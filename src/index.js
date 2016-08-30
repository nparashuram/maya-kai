import EventPluginRegistry from 'react/lib/EventPluginRegistry';
import ReactNativeEventEmitter from 'react/lib/ReactNativeEventEmitter';

import JSOG from './jsog';

import {SERVER, PORT, WS_PROTOCOL, MSG_ID, MSG_EVENT} from './constants';

const ID = Math.random();

export default class Plugin {
    constructor() {
        var ws = new WebSocket('ws://' + SERVER + ':' + PORT, WS_PROTOCOL);
        ws.onopen = (e) => console.log('Socket Opened');
        ws.onerror = (e) => console.log('Socket Error', e.message);
        ws.onclose = (e) => console.log('Socket Closed', e.code, e.reason);

        ws.onmessage = (({ data}) => this.handleMessage(data));

        this.send = msg => ws.send(JSON.stringify(msg));
    }

    handleMessage(data) {
        let message = JSON.parse(data);
        if (message.origin === ID || message.type !== MSG_EVENT) {
            return;
        }
        let { rootNodeID, topLevelType, nativeEventParam } = JSOG.parse(message.payload);
        nativeEventParam.isMirrored = true;
        ReactNativeEventEmitter._receiveRootNodeIDEvent(rootNodeID, topLevelType, nativeEventParam);
    }

    extractEvents(topLevelType, nativeEventTarget, nativeEventParam) {
        if (nativeEventParam.isMirrored){
            return;
        }
        let rootNodeID = nativeEventTarget._rootNodeID;
        let payload = JSOG.stringify({ rootNodeID, topLevelType, nativeEventParam });
        this.send({
            type: MSG_EVENT,
            origin: ID,
            payload
        });
        return null;
    }
}

// TODO This is not the best way to inject plugins. Use public APIs instead
// Use EventPluginRegistry._resetEvent() and then re-inject plugins in the order specified in ReactNativeDefaultInjection
EventPluginRegistry.plugins.push(new Plugin());