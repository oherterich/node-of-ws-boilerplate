var express = require('express');
var directory = require('serve-index');
var fs = require('fs');
var WebSocketServer = require('ws').Server;

var WWW_ROOT = './www';
var SOCKET_IO_PORT = 8080;
var WEBSOCKET_PORT = 8081;

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
  socket.on('rand-num', function(data) {
    console.log('New data! ' + data.num);

    // When we get our message, send one back with the same information.
    socket.emit('rand-num', { num: data.num });

    // Also send a message to openFrameworks with our data.
    if (OF) {
      OF.send('rand-num,' + data.num);
    }
  });

  // When a client disconnets, let us know.
  socket.on('disconnect', function() {
    console.log('disconnected: ' + socket.id);
  });
});

// Create variable for our openFrameworks websocket connection
var OF;

// Create the actual server for our ws and set it to listen to our port.
var wss = new WebSocketServer({ port: WEBSOCKET_PORT });

// When we have a connection through websockets...
wss.on('connection', function(ws) {

  console.log("[WS] :: A new websocket connection was made!");

  // When we get any message from our websocket connection
  ws.on('message', function(msg) {

      // This is one of the reasons that the 'ws' library is more difficult to use that socket.io
      // We need to figure out the best way to format our data and messages.
      // In this case, we're using a CSV format: the first value is the message name, and the rest is data.
      var parts = msg.split(",");
      var event = parts[0];

      // If we get the confirmation message from openFrameworks, we know that this specific websocket connection is OF.
      // Also send a message back to confirm we are connected.
      if (event == "init-of") {
          OF = ws;
          ws.send("connected");
      }
  });

  // When our websocket disconnects.
  ws.on('close', function() {
    console.log("[WS] :: A websocket was closed.");

    // If the websocket that is disconnecting is openFrameworks, reset the OF variable.
    if (OF == ws) {
      OF = null;
    }
  });
});