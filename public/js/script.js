var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + " wants to join " + room + "!");

$(".room-title").text("Chat Room: " + room);

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
    var $messages = $('.messages');
    var messageType;
    if (message.name == name) {
        messageType = "myMessage";
    } else {
        messageType = "incomingMessage";
    }
    var $message = $("<li class='clearfix list-group-item " + messageType + "'></li>");
    $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + ': </strong></p>');
    $message.append("<p>" + message.text + "</p>");
    $messages.append($message);

    $(".list-group").scrollTop($(".list-group")[0].scrollHeight);

});

var $form = $('#message-form');

//Takes care of pressing enter in a textarea

$('textarea').keypress(function(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        $form.submit();
    }
});

// Handles submitting of new message

$form.on('submit', function(e) {
    e.preventDefault();

    var $message = $form.find('textarea[name=message]');

    socket.emit('message', {
        name: name,
        text: $message.val()
    });

    $message.val("");
});

//Prevents browser scrolling when scrolling through chat

$('.list-group').on('mousewheel DOMMouseScroll', function(e) {

    var e0 = e.originalEvent;
    var delta = e0.wheelDelta || -e0.detail;

    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
});
