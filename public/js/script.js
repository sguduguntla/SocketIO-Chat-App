var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + " wants to join " + room + "!");

$(".room-title").text(room);

socket.on('connect', function() {
    console.log("Connected to socket.io server!");

    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function(message) {
    var momentTimestamp = moment.utc(message.timestamp);
    console.log('New message:');
    console.log(message.text);
    var $message = $('.messages');
    $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.format('h:mm a') + ': </strong></p>');
    $message.append("<p>" + message.text + "</p>");
});

// Handles submitting of new message
var $form = $('#message-form');

$form.on('submit', function(e) {
    e.preventDefault();

    var $message = $form.find('input[name=message]');

    socket.emit('message', {
        name: name,
        text: $message.val()
    });

    $message.val("");
});
