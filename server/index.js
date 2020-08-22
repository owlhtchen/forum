#!/usr/bin/env nodejs
const express = require('express');
const path = require('path');
const cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const http = require('http');
const socketio = require('socket.io');

const users = require('./routes/user');
const posts = require('./routes/post');
const tags = require('./routes/tag');
const uploads = require('./routes/multer');
const searchs = require('./routes/search');
const chatrooms = require('./routes/chatroom');
const notifications = require('./routes/notification');

mongoose.connect('mongodb://localhost/forum', {
    useNewUrlParser: true,
    useFindAndModify: false
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("connected to mongod");

    mongoose.connection.db.listCollections({name: 'tags'})
        .next(async function (err, collinfo) {
            if (!collinfo) {
            }
        });

    const app = express();
    const server = http.createServer(app);

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    if(process.env.NODE_ENV === "dev") {
        app.use(cors());
    }

    // Serve the static files from the React app
    // console.log(path.join(__dirname, '../client/public'));
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.use(express.static(path.join(__dirname, '../client/public/avatars')));
    app.use(express.static(path.join(__dirname, '../client/public/default_avatars')));

    // https://socket.io/docs/server-api/
    const io = socketio(server);
    require('./socket')(io);

    app.use('/users-back', users);
    app.use('/posts-back', posts);
    app.use('/tags-back', tags);
    app.use('/upload-back', uploads);
    app.use('/search-back', searchs);
    app.use('/chat-rooms-back', chatrooms);
    app.use('/notifications-back', notifications);

    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });

    // Handles any requests that don't match the ones above
    app.get('*', (req, res) => {
        if(process.env.NODE_ENV === "dev") {
            console.log(__dirname);
            res.status(404).sendFile(path.join(__dirname + '/../client/public/not-found.html'));
        } else {
            res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
        }
    });

    const port = process.env.PORT || 5000;
    server.listen(port, () => {
        console.log('Express App is listening on port ' + port);
    });
});
