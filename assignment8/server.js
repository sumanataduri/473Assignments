/* globals require,__dirname */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app).listen(3000),
    io = require('socket.io').listen(server),
    mongoose = require('mongoose');

app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost/todo', function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('connected to mongodb');
    }
});
var todoSchema = mongoose.Schema({
    todo: String,
    created: {
        type: Date,
        default: Date.now
    }

});

var todomodel = mongoose.model('ToDo', todoSchema);

app.get('/', function(req, res) {
    res.send("received a get req");
    //res.sendFile(__dirname + '/public/tab.html');
});
io.on('connection', function(socket) {

    todomodel.find({}, function(err, docs) {
        if (err) throw err;
        console.log("socket io server started");
        io.sockets.emit('load old todos', docs);
        console.log('server: is sending old todos');
    });

    socket.on('send message', function(data) {
        console.log("message received on server");
        var newtodo = new todomodel({
            todo: data
        });
        newtodo.save(function(err) {
            if (err) throw err;
            todomodel.find({
                todo: data
            }, function(err, docs) {
                io.sockets.emit('new message', docs);
                console.log("Server: sending new message to client");
            });
        });


    });

});