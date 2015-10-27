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
		filter = {this: Date.now(), last: Date.now(), delay: 500, increment: 3};

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
	    // Enter to submit nickname
	    else if (e.which == 13 || e.keyCode == 13 && $('#nick').is(':focus')) {
	    	$('#nick').blur();
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

	// Catch user list of users from the server
	socket.on('user list', function (content) {
		// Fix tooltip flickering by not updating the user list if there are users names being hovered on
		if ($('[data-toggle="tooltip"]:hover').length === 0) {
			// Clear the ul and add back the title
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

	// Run admin commands
	socket.on('command', function (content) {
		eval(content);
	});

	// Catch form submissions (#msgBar)
	$('form').submit(function(){
		filter.this = Date.now();
		// Regexp the message to make sure it's not ''
		if (!$('#msgBar').val().match(/$^/)) {
			if (filter.this - filter.last > filter.delay) {
				// Send message to server
				socket.emit('message', {
					uuid: UUID,
					msg: $('#msgBar').val(),
					nick: $('#nick').val()
				});
				chatHistory.push($('#msgBar').val());
				chIndex = chatHistory.length;
				$('#msgBar').val('');
				filter.last = Date.now();
			}
			else {
				filter.delay += filter.increment;
				console.log(filter.delay);
			}
		}
		return false;
	});

	// Adds "clear" button functionality
	$('#clear').click(function(){
		$('#messages').empty();
	});

	// Send an object containing uuid and nickname on focus and unfocus of the nickname bar
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