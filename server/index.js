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

    app.use(cors());

    // Serve the static files from the React app
    // console.log(path.join(__dirname, '../client/public'));
    app.use(express.static(path.join(__dirname, '../client/public/avatars')));
    app.use(express.static(path.join(__dirname, '../client/public/default_avatars')));

    // https://socket.io/docs/server-api/
    const io = socketio(server);
    require('./socket')(io);

    app.use('/users', users);
    app.use('/posts', posts);
    app.use('/tags', tags);
    app.use('/upload', uploads);
    app.use('/search', searchs);
    app.use('/chat-rooms', chatrooms);
    app.use('/notifications', notifications);

    // Handles any requests that don't match the ones above
    app.get('*', (req, res) => {
        console.log(__dirname);
        res.status(404).sendFile(path.join(__dirname + '/../client/public/not-found.html'));
    });

    const port = process.env.PORT || 5000;
    server.listen(port, () => {
        console.log('Express App is listening on port ' + port);
    });
});
