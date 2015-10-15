$(function(){
	var UUID = (Math.random().toString()).substring(2, 10);
	var ips = getIPs(function(ips){return ips});
	console.log(ips);
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
			ips: ips
		});
		chatHistory.push($('#msgBar').val());
		chIndex = chatHistory.length;
		$('#msgBar').val('');
		return false;
	});
});
