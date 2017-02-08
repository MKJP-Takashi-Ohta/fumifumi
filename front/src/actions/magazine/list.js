/* @flow */
import createAction from "actions/lib/create-action";

const action = createAction("magazine.list");

export default {
    "fetch": action("fetch"),
    "fetchNext": action("fetch-next"),
    "show": action("show"),
    "start": action("start")
};
