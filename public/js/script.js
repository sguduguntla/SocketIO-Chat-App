var socket = io();

socket.on('connect', function() {
    console.log("Connected to socket.io server!");
});

socket.on('message', function(message) {
    $('.messages').append("<p>" + message.text + "</p>");
    console.log('New message:');
    console.log(message.text);
});

// Handles submitting of new message
var $form = $('#message-form');

$form.on('submit', function(e) {
    e.preventDefault();

    var $message = $form.find('input[name=message]');

    socket.emit('message', {
        text: $message.val()
    });

    $message.val("");
});
