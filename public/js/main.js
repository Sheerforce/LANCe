$(function(){

	// Load audio file
	var ding = new Audio('assets/ding.mp3');

	// Set default notifyjs className
	$.notify.defaults({ className: 'success' });

	// Initialize jQuery-UI on send button

	// Generate a unique UUID,
	// Create a socket.io instance,
	// Initialize variables for up/down chat history,
	// Set notification location,
	// Store time between messages
	var		
		UUID = (Math.random().toString()).substring(2, 10),
		socket = io(),
		chatHistory = [],
		chIndex = 0,
		notificationPos = 'right top',
		msgDelay = {this: 0, last: 0};

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
		if (sender != UUID && sender != $('#nick').val()) {
			$.notify(
				'Message From: ' + sender,
				{ position: notificationPos }
			);
			ding.play();
		}
		else {
			$.notify(
				'Message Sent',
				{ position: notificationPos }
			);
		}
		$('#messages').append('<li>' + content.time + ' ' + sender + ' : ' + content.msg + '</li>');
		scrollToBottom();
	});

	$('form').submit(function(){
		socket.emit('message', {
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
			{ position: notificationPos }
		);
	});
	$('#nick').focusout(function(){
		$.notify(
			'Nickname Changed',
			{ position: notificationPos }
		);
	});
});