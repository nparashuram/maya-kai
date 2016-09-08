// Test client that sends messages back after a delay

var WebSocket = require('ws');

var _ = require('./../config');
var JSOG = require('./../util/jsog');

var ID = Math.random();

var ws = new WebSocket('ws://' + _.SERVER + ':' + _.PORT);
ws.on('open', () => console.log('Connection opened with server '));
ws.on('message', (data, flags) => {
    var msg = JSON.parse(data);
    if (msg.type === _.MSG_EVENT && msg.origin !== ID) {
        var decodedPayload = JSOG.parse(msg.payload);
        console.log('Got Message from ', msg.origin, 'of type ', decodedPayload.topLevelType);
        setTimeout(() => {
            console.log('Echoing back message from ', msg.origin, ' of type ', decodedPayload.topLevelType);
            ws.send(JSON.stringify({
                type: _.MSG_EVENT,
                origin: ID,
                payload: msg.payload
            }))
        }, 5000);
    }
});
