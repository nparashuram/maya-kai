// Test client that sends messages back after a delay
var fs = require('fs');
var WebSocket = require('ws');

var config = require('./../config');
var argv = require('minimist')(process.argv.slice(2), {
    default: {
        port: config.PORT,
        server: config.SERVER,
    },
    alias: {
        port: 'p',
        server: 's',
    },
});

var JSOG = require('./../util/jsog');

var ID = Math.random();
var startTime = new Date().getTime();

var filename = argv[0] || '_actions.log';
console.log('Recording actions at ', filename);

fs.writeFileSync(filename, '', 'utf-8');

var ws = new WebSocket('ws://' + argv.server + ':' + argv.port);
ws.on('open', () => console.log('Connected to server'));
ws.on('message', (data, flags) => {
    var msg = JSON.parse(data);
    if (msg.type === config.MSG_EVENT && msg.origin !== ID) {
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
