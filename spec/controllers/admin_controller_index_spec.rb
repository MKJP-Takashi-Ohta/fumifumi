# frozen_string_literal: true

RSpec.describe AdminController, type: :controller do
  describe '#index' do
    it do
      get :index
      expect(response).to be_ok
    end
  end
end