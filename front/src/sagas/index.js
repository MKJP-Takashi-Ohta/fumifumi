import {fork} from "redux-saga/effects";
import magazine from "./magazine";

export default function *() {
    yield fork(magazine);
}
