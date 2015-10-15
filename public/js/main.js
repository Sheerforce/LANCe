$(function(){
	var UUID = (Math.random().toString()).substring(2, 10);
	var local_ip = getIPs(function(ip){return ip[0]});
	var public_ip = getIPs(function(ip){return ip[1]});
	var socket = io();
	var chatHistory = [];
	var chIndex = 0;

	var formatTime = function(){
		var d = new Date();
		var a = d.getHours(), b = d.getMinutes(), c = d.getSeconds();
		return '[' + [a,b,c].join(':') + ']';
	}

	var scrollToBottom = function(){
		window.scrollTo(0, document.body.scrollHeight);
	}

	window.addEventListener('keydown', function(e){
		if(e.keyCode == 38 && $('#msgBar').is(':focus') && chIndex >= 0){
			chIndex--;
			$('#msgBar').val(chatHistory[chIndex]);
		}
		else if(e.keyCode == 40 && $('#msgBar').is(':focus') && chIndex < chatHistory.length){
			chIndex++;
			$('#msgBar').val(chatHistory[chIndex]);
		}
	});

	socket.on('message', function(content){
		console.log(content);
		$('#messages').append('<li>' + content.time + ' ' + (!!content.nick ? content.nick : content.uuid) + ' : ' + content.msg + '</li>');
		$('li:last-of-type');
		scrollToBottom();
	});

	$('form').submit(function(){
		socket.emit('message', {
			time: formatTime(),
			uuid: UUID,
			msg: $('#msgBar').val(),
			nick: $('#nick').val(),
			userAgent: navigator.userAgent,
			localIP: local_ip,
			publicIP: public_ip
		});
		chatHistory.push($('#msgBar').val());
		chIndex = chatHistory.length;
		$('#msgBar').val('');
		return false;
	});
});
