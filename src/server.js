#!/usr/bin/env node

var config = require('./config');
var WebSocketServer = require('ws').Server;
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

var wss = new WebSocketServer({ port: argv.port });

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
console.log('Started WebSocket Broadcast Server at ' + argv.server + ':' + argv.server);
