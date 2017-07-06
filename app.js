var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket) {
    console.log("User connected via socket.io!");

    //When a user disconnects from a room
    socket.on('disconnect', function() {
        var userData = clientInfo[socket.id];
        if (typeof userData !== 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + ' has left!',
                timestamp: moment().valueOf()
            });

            delete clientInfo[socket.id];
        }
    });

    socket.on('joinRoom', function(req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined!',
            timestamp: moment().valueOf()
        });
    });

    socket.on('message', function(message) {
        console.log('Message Received: ' + message.text);

        message.timestamp = moment().valueOf();

        io.to(clientInfo[socket.id].room).emit('message', message) //sends to everyone including sender

        //socket.broadcast.emit('message', message); //sends to everyone but the sender
    });

    socket.emit('message', {
        name: "System",
        text: 'Welcome to the chat application',
        timestamp: moment().valueOf()
    });
});

http.listen(PORT, function() {
    console.log("Server started on port " + PORT);
});
