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

var socketUId = 1;

wss.on('connection', function (socket) {
  socket.id = socketUId++;
  console.log('Client connected:[', socket.id, ']. Total clients:', wss.clients.length);
  socket.on('message', function (data, flags) {
    wss.broadcast(data);
  });
  socket.on('close', function () {
    console.log('Client disconnected:[', socket.id, ']. Total clients:', wss.clients.length);
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
console.log('Started WebSocket Broadcast Server at ' + argv.server + ':' + argv.port);
