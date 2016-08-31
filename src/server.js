var _ = require('./constants');
var WebSocketServer = require('ws').Server

var wss = new WebSocketServer({ port: _.PORT });

wss.on('connection', function (socket) {
  console.log('Client connected');
  socket.on('message', function (data, flags) {
    wss.broadcast(data);
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
console.log('Started WebSocket Broadcast Server at ' + _.SERVER + ':' + _.PORT);