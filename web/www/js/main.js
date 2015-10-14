//Initialize socket and get data
var socket = io.connect('http://' + window.location.hostname + ':8080');

// Listen for the initial connection event with the server
// Normally  you can give a message any name you want, but this is a special case.
// 'connect' is a reserved message name for SocketIO.
socket.on('connect', function() {
  console.log('connected!')
});

// Listen for the 'oh-hey' event that is coming from the server.
socket.on('rand-num', function(data) {
  console.log('Wow! ' + data.num);
});

// Send 'hello' to server
function sendHelloMessage() {
  var randomNum = Math.random() * 10;

  // Send the server a message called 'hello' which contains a JS object with a random number.
  // Remember - you're never sending information directly to other clients (browsers).
  // You usually use the server as the central hub to distribute information.
  socket.emit('rand-num', { num: randomNum });
}

//Button event
var messageButton = document.querySelector('.cool-ass-button');
messageButton.addEventListener('click', function(e) {
  e.preventDefault();

  // On button click, send our 'hello' message.
  sendHelloMessage();
});
