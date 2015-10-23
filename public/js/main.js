$(function(){
	$.notify.defaults({ className: 'success' });

	var UUID = (Math.random().toString()).substring(2, 10)
	var socket = io();
	var chatHistory = [];
	var chIndex = 0;
	var nick = '';


	var formatTime = function(){
		var d = new Date();
		var a = d.getHours(), b = d.getMinutes(), c = d.getSeconds();  
		return '[' + [a,b,c].join(':') + ']';
	}

	var scrollToBottom = function(){
		window.scrollTo(0, document.body.scrollHeight);
	}

	window.addEventListener('keydown', function(e){
		if(e.keyCode == 220){
			console.log(chatHistory + ' ' + chIndex);
		}
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
		sender = (content.nick ? content.nick : content.sender)
		if (!sender == $('#nick').val() || UUID) {
			$.notify(
				'Message From: ' + sender,
				{ position: 'top center' }
			);
		}

		else {
			$.notify(
				'Message Sent',
				{ position: 'top center' }
			);
		}
		$('#messages').append('<li>' + content.time + ' ' + sender + ' : ' + content.msg + '</li>');
		$('li:last-of-type');
		scrollToBottom();
	});

	$('form').submit(function(){
		socket.emit('message', {
			time: formatTime(),
			sender: UUID,
			msg: $('#msgBar').val(),
			nick: $('#nick').val().substring(0, 20)
		});
		chatHistory.push($('#msgBar').val());
		chIndex = chatHistory.length;
		$('#msgBar').val('');
		return false;
	});
	$('#clear').click(function(){
		$('#messages').empty();
		$.notify(
			'Chat Cleared',
			{ position: 'top center' }
		);
	});
	$('#nick').focusout(function(){
		$.notify(
			'Nickname Changed',
			{ position: 'top center' }
		);
	});
});