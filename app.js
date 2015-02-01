
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

// Socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Philips Hue
var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

// Express
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// ### SOCKET.IO ###
io.on('connection', function(socket){
  console.log('Socket.io: New connection established!');

  socket.on('disconnect', function(){
    console.log('Socket.io: A connection was terminated!');
  });

  socket.on('Zero orientation', function(){
  	resetOrientation();
  });
});

function resetOrientation(){
	myMyo.zeroOrientation();
  	console.log('Zeroed orientation!');
}

// ### PHILIPS HUE ###
var displayBridges = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var displayStatus = function(status) {
    console.log(JSON.stringify(status, null, 2));
};

var hostname = "10.0.0.23",
    username = "2b2a8b3a20a7357713ec10a638de4a93",
    api;

api = new HueApi(hostname, username);

state = lightState.create().on().white(500, 10);
api.setLightState(3, state)
    .then(displayResult)
    .done();

api.lightStatus(2)
    .then(displayStatus)
    .done();

// Routes

app.get('/', routes.index);

// Start the server
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
