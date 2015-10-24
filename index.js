var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var ip = require('ip');
var port = 80;
var clients = [];

var formatTime = function(){
	var d = new Date();
	var a = d.getHours(), b = d.getMinutes(), c = d.getSeconds();  
	return '[' + [a,b,c].join(':') + ']';
}

server.listen(port, ip.address(), function() {
	console.log('Server listening on ' + ip.address() + (port == 80 ? '' : ':' + port) + '.'); 
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	clients.push(socket);

	socket.on('message', function (content) {
		console.log(content);
		io.emit('message', { time: formatTime(), sender: content.sender, msg: content.msg, nick: content.nick });
	});
	socket.on('disconnect', function (content) {
		clients.splice(clients.indexOf(socket), 1);
	});
	socket.on('userinfo', function (content) {
		console.log('Received content: ' + content);
		socket.uuid = content.uuid;
		socket.nick = content.nick;
	});
});

setInterval(function(){
	var users = [];
	for (var i in clients) {
		users.push(clients[i].nick != '' ? clients[i].nick : clients[i].uuid);
	}
	console.log('Emitting user list: ' + users);
	io.emit('user list', users);
}, 100);