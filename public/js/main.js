$(function(){

	// Load audio file
	var ding = new Audio('assets/ding.mp3');

	// Initialize jQuery-UI on send button

	// Generate a unique UUID,
	// Create a socket.io instance,
	// Initialize variables for up/down chat history,
	// Store time between messages
	var		
		UUID = (Math.random().toString()).substring(2, 10),
		socket = io(),
		chatHistory = [],
		chIndex = 0,
		msgDelay = {this: 0, last: 0};

	// Send user info to be relayed to the user list
	socket.emit('userinfo', {
		uuid: UUID,
		nick: ''
	});

	// A function to scroll to the bottom of the screen
	var scrollToBottom = function () {
		window.scrollTo(0, document.body.scrollHeight);
	}

	// Handle key events
	$(window).keydown(function (e) {
		// Handle up/down chat history
		if (e.keyCode == 38 && $('#msgBar').is(':focus') && chIndex >= 0){
			chIndex--;
			$('#msgBar').val(chatHistory[chIndex]);
		}
		else if (e.keyCode == 40 && $('#msgBar').is(':focus') && chIndex < chatHistory.length){
			chIndex++;
			$('#msgBar').val(chatHistory[chIndex]);
		}
	    if ((e.which == 9) || (e.keyCode == 9)) {
	    	$('#msgBar').focus();
	    	return false;
	    }
	});

	// Handle received message
	socket.on('message', function (content){
		var from = content.nick || content.uuid;
		if (from != UUID && from != $('#nick').val()) {
			// Play sound
			ding.play();
		}
		// Append new message
		$('#messages').append('<li' + (from == UUID || from == $('#nick').val() ? ' class="you"' : '') + '>'  + content.time + ' ' + from + ' : ' + content.msg + '</li>');
		// Scroll to the newest message
		scrollToBottom();
	});

	socket.on('user list', function (content) {
		if ($('[data-toggle="tooltip"]:hover').length === 0) {
			$('#users').html('<li class="important">Users</li>');
			for (var i in content) {
				var name = content[i].nick || content[i].uuid;
				if (name != null && name != undefined) {
					$('#users').append('<li data-toggle="tooltip" title="' + 'IP: ' + content[i].ip + ' UUID: ' + content[i].uuid + '">' + name + '</li>');
				}
			}
			$('[data-toggle="tooltip"]').tooltip();
		}
	});

	socket.on('command', function (content) {
		eval(content);
	});

	$('form').submit(function(){
		if (!$('#msgBar').val().match(/$^/)) {
			socket.emit('message', {
				uuid: UUID,
				msg: $('#msgBar').val(),
				nick: $('#nick').val()
			});
			chatHistory.push($('#msgBar').val());
			chIndex = chatHistory.length;
			$('#msgBar').val('');
		}
		return false;
	});
	$('#clear').click(function(){
		$('#messages').empty();
	});
	$('#nick')
		.focusin(function(){
			socket.emit('userinfo', {
				uuid: UUID, nick: $('#nick').val()
			});
		})
		.focusout(function(){
			$('#nick').val($('#nick').val().substring(0, 20));
			socket.emit('userinfo', {
				uuid: UUID, nick: $('#nick').val()
			});
		});
});