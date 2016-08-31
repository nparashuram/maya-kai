import EventPluginRegistry from 'react/lib/EventPluginRegistry';
import ReactNativeEventEmitter from 'react/lib/ReactNativeEventEmitter';

import JSOG from './util/jsog';

import {SERVER, PORT, MSG_ID, MSG_EVENT} from './constants';

const ID = Math.random();

const log = console.log.bind(console);

class Plugin {
    init(host = SERVER + ':' + PORT) {
        return new Promise((resolve, reject) => {
            var ws = new WebSocket('ws://' + host);
            ws.onopen = (e) => resolve(e);
            ws.onerror = (e) => reject(e);

            ws.onclose = (e => log('Socked closed'));
            ws.onmessage = (({data}) => this.handleMessage(data));

            this.close = (code, data) => ws.close(code, data);
            this.send = msg => ws.send(JSON.stringify(msg));
        });
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
        if (nativeEventParam.isMirrored) {
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

let plugin = new Plugin();
let position = null;

export default main = {
    start(...args) {
        return plugin.init(...args).then(() => {
            // TODO This is not the best way to inject plugins. Use public APIs instead
            // Use EventPluginRegistry._resetEvent() and then re-inject plugins in the order specified in ReactNativeDefaultInjection
            position = EventPluginRegistry.plugins.push(plugin);
        });
    },
    stop() {
        plugin.stop();
        EventPluginRegistry.plugins.splice(position - 1, 1);
    }
}