// Test client that sends messages back after a delay
var fs = require('fs');
var WebSocket = require('ws');

var _ = require('./../constants');

var ID = Math.random();
var startTime = new Date().getTime();

var filename = process.argv[2] || '_actions.log';
console.log('Replaying actions from ', filename);

var actions = JSON.parse('[' + fs.readFileSync(filename, 'utf-8') + 'null]');
var ws = new WebSocket('ws://' + _.SERVER + ':' + _.PORT);
ws.on('open', () => {
    console.log('Starting to replay actions');
    sendMessage();
});

var index = 0;
function sendMessage() {
    if (actions[index] === null || actions[index + 1] === null) {
        console.log('Reached end of activity stream');
        ws.close();
        return;
    }
    setTimeout(sendMessage, actions[index + 1].time - actions[index].time);
    ws.send(JSON.stringify({
        type: _.MSG_EVENT,
        origin: ID,
        payload: actions[index].payload
    }));
    console.log(index, 'Time: ', actions[index].time);
    index++;
}