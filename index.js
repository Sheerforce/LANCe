var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var ip = require('ip');
var port = 80;

server.listen(port, ip.address(), function(){
	console.log('Server listening on ' + ip.address() + (port == 80 ? '' : ':' + port) + '.'); 
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	socket.on('message', function(content){
		console.log(content);
		io.emit('message', content);
	});
});
