import React from "react";
import Page from "./Page";
import Types from "./types";
import Scroll from "./Scroll";
import b from "components/lib/b";
import connect from "components/lib/connect";
import action from "actions/magazine/list";

@connect("magazine.list")
export default class extends React.Component {
    static displayName = "MagazineList.Magazine"
    static propTypes = Types.magazine;

    onClick (episode) {
        const {dispatch} = this.props;

        dispatch(action.show(episode));
    }

    render () {
        const {title, cover, selectedEpisode, episodes} = this.props;
        const magazine = b.with("magazineLayout");
        const magazineEpisode = b.with("magazineEpisodeLayout");

        return (
            <div className={magazine()}>
                <div className={magazine("title")}>
                    {title}
                </div>
                <div className={magazine("content")}>
                    <Scroll layout={magazineEpisode}>
                        {[
                            <Page
                                key="cover"
                                layout={magazineEpisode("content")}
                                {...cover}
                            />,
                            ...episodes.map((e) =>
                                <Page
                                    focus={e.id === selectedEpisode.id}
                                    key={e.id}
                                    layout={magazineEpisode("content")}
                                    onClick={() => this.onClick(e)}
                                    url={e.url}
                                    {...e.page}
                                />)
                        ]}
                    </Scroll>
                </div>
            </div>
        );
    }
}
