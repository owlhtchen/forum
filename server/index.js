const express = require('express');
const path = require('path');
const cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const users = require('./routes/user');
const posts = require('./routes/post');
const tags = require('./routes/tag');
const uploads = require('./routes/multer');
const searchs = require('./routes/search');

const Tag = require('./models/tag');

mongoose.connect('mongodb://localhost/forum', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("connected to mongod");

    mongoose.connection.db.listCollections({name: 'tags'})
        .next(async function (err, collinfo) {
            if (!collinfo) {
                // console.log("Root Tag created");
                // const rootTag = new Tag({
                //     name: "Root Tag"
                // });
                // await rootTag.save();
            }
        });

    const app = express();

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(cors());

    // Serve the static files from the React app
    // console.log(path.join(__dirname, '../client/public'));
    app.use(express.static(path.join(__dirname, '../client/public/avatars')));
    app.use(express.static(path.join(__dirname, '../client/public/default_avatars')));

    let http = require('http').createServer(app);
    let io = require('socket.io')(http);
    require('./socket')(io);

    app.use('/users', users);
    app.use('/posts', posts);
    app.use('/tags', tags);
    app.use('/upload', uploads);
    app.use('/search', searchs);

    // Handles any requests that don't match the ones above
    app.get('*', (req, res) => {
        console.log(__dirname)
        res.sendFile(path.join(__dirname + '/../client/public/not-found.html'));
    });

    const port = process.env.PORT || 5000;
    // app.listen(port);
    // console.log('App is listening on port ' + port); 

    http.listen(port, function () {
        console.log('socket.io is listening on ' + port);
    })
});
