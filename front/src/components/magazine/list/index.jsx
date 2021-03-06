import React from "react";
import ReactPlaceholder from "react-placeholder";
import Magazine from "./Magazine";
import MagazinePager from "./MagazinePager";
import Placeholder from "./placeholder";
import connect from "components/lib/connect";
import {mainLayout} from "components/layout";

@mainLayout @connect("magazine.list")
export default class extends React.Component {
    static displayName = "MagazineList"
    static propTypes = {
        "dispatch": React.PropTypes.func,
        "magazines": React.PropTypes.arrayOf(Object),
        "ready": React.PropTypes.bool
    };
    static defaultProps = {
        "dispatch": null,
        "magazines": [],
        "ready": false
    };

    componentDidMount () {
        this.props.dispatch({"type": "saga.magazine.list.fetch"});
    }

    render () {
        const {magazines} = this.props;

        return (
            <ReactPlaceholder
                customPlaceholder={Placeholder}
                ready={this.props.ready}
            >
                <MagazinePager>
                    {magazines.map((m) =>
                        <Magazine
                            key={m.id}
                            {...m}
                        />) }
                </MagazinePager>
            </ReactPlaceholder>
        );
    }
}
