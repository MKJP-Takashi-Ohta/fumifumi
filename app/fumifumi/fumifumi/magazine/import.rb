# frozen_string_literal: true
module Fumifumi
  module Magazine
    class Import
      def initialize(magazine)
        @magazine = magazine
      end

      def call
        update_magazine do |magazine|
          magazine.update! title: book.title, finished_at: Time.current
          pages = {}

          each_page do |item, content, no|
            pages[item.href] = magazine.pages.create!(no: no, content: content)
          end

          magazine.create_toc! toc(pages)
        end
      end

      private

      attr_reader :magazine

      def book
        @book ||=
          begin
            tempfile do |temp|
              magazine.source.copy_to_local_file(:original, temp.path)
              GEPUB::Book.parse(temp.path)
            end
          end
      end

      def items
        @items ||= book.manifest.item_list
      end

      def pages
        @pages ||= book.spine.itemref_list.map { |ref| ref['idref'] }
      end

      # find image link from page
      def image_link(text)
        html = Nokogiri::HTML(text)

        html.css('image').first&.[]('xlink:href') ||
          html.css('img').first&.[]('src')
      end

      def find_by_path(path)
        items.values.find { |item| item.href == path }
      end

      def image_item(item)
        relative_path = image_link(item.content)
        return nil unless relative_path.present?

        path = Pathname(item.href).join('..', relative_path).to_s
        find_by_path(path)
      end

      def update_magazine
        ApplicationRecord.transaction do
          magazine.reset!
          magazine.tap(&Proc.new).reload
        end
      end

      def each_page
        pages.each.with_index do |page, index|
          item = image_item(items[page])
          next unless item

          tempfile do |temp|
            temp.write item.content
            yield items[page], temp, index
          end
        end
      end

      def each_nav
        html = Nokogiri::HTML(items['ncx'].content)
        html.css('navpoint').each do |e|
          yield e.css('text').text, e.css('content').attribute('src').value
        end
      end

      def toc(pages)
        hash = {}

        each_nav do |title, ref|
          hash[pages[ref]] = episode(title)
        end

        hash
      end

      def episode(title)
        ::Episode.new(Fumifumi::Episode::Info.new(title).call)
      end

      def tempfile
        Tempfile.create(encoding: Encoding::ASCII_8BIT, &Proc.new)
      end
    end
  end
end
