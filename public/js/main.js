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

	socket.emit('userinfo', {
		uuid: UUID,
		nick: ''
	});

	var scrollToBottom = function () {
		window.scrollTo(0, document.body.scrollHeight);
	}

	$(window).keydown(function (e) {
		if(e.keyCode == 38 && $('#msgBar').is(':focus') && chIndex >= 0){
			chIndex--;
			$('#msgBar').val(chatHistory[chIndex]);
		}
		else if(e.keyCode == 40 && $('#msgBar').is(':focus') && chIndex < chatHistory.length){
			chIndex++;
			$('#msgBar').val(chatHistory[chIndex]);
		}
	});

	socket.on('message', function (content){
		console.log(content);
		var from = content.nick || content.sender;
		if (from != UUID && from != $('#nick').val()) {
			ding.play();
		}
		$('#messages').append('<li>' + content.time + ' ' + from + ' : ' + content.msg + '</li>');
		scrollToBottom();
	});

	socket.on('user list', function (content) {
		$('#users').html('<li class="important">Users</li>');
		for (var i in content) {
			if (content[i].name != null && content[i] != undefined) {
				$('#users').append('<div data-toggle="tooltip" title="' + 'IP: ' + content[i].address + '">' + '<li>' + content[i].name + '</li></div>');
			}
		}
		$('[data-toggle="tooltip"]').tooltip(); 
	});

	socket.on('command', function (content) {
		eval(content);
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
	});
	$('#nick')
		.focusin(function(){
			socket.emit('userinfo', {
				uuid: UUID, nick: $('#nick').val()
			});
		})
		.focusout(function(){
			socket.emit('userinfo', {
				uuid: UUID, nick: $('#nick').val()
			});
		});
});