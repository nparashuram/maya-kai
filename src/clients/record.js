// Test client that sends messages back after a delay
var fs = require('fs');
var WebSocket = require('ws');

var _ = require('./../constants');
var JSOG = require('./../util/jsog');

var ID = Math.random();
var startTime = new Date().getTime();

var filename = process.argv[2] || '_actions.log';
console.log('Recording actions at ', filename);

fs.writeFileSync(filename, '', 'utf-8');

var ws = new WebSocket('ws://' + _.SERVER + ':' + _.PORT);
ws.on('open', () => console.log('Connected to server'));
ws.on('message', (data, flags) => {
    var msg = JSON.parse(data);
    if (msg.type === _.MSG_EVENT && msg.origin !== ID) {
        var time = new Date().getTime() - startTime;
        var event = JSON.parse(msg.payload);
        console.log(time + ':' + event.topLevelType, event.rootNodeID);
        fs.appendFileSync(filename, JSON.stringify({
            time: time,
            origin: msg.origin,
            payload: msg.payload
        }) + ',\n');
    }
});