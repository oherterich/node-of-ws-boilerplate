var express = require('express');
var directory = require('serve-index');
var fs = require('fs');

var WWW_ROOT = './www';
var SOCKET_IO_PORT = 8080;

// Create Express server (so that front-end can access files)
var app = express();
var server = require('http').createServer(app);

// Create instance of SocketIO and listen to server.
var io = require('socket.io').listen(server);

// Set our server to send information through specfic port.
server.listen(SOCKET_IO_PORT);

// Figure out what to send to the browser and serve it.
app.use(directory(WWW_ROOT));
app.use(express.static(WWW_ROOT));

console.log('Server has started on port ' + SOCKET_IO_PORT);

// A SocketIO connection has been made with the browser.
io.sockets.on('connection', function (socket) {
  console.log('new connection: ' + socket.id);

  // Listen for 'hello' message from client.
  socket.on('hello', function(data) {
    console.log('New data! ' + data.num);

    // When we get our message, send one back with the same information.
    socket.emit('oh-hey', { num: data.num });
  });

  // When a client disconnets, let us know.
  socket.on('disconnect', function() {
    console.log('disconnected: ' + socket.id);
  });
});