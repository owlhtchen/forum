const express = require('express');
const path = require('path');
const cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const users = require('./routes/user');
const posts = require('./routes/post');
const categories = require('./routes/category');

const Category = require('./models/category');

mongoose.connect('mongodb://localhost/forum', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to mongod");
  mongoose.connection.db.listCollections({name: 'categories'})
    .next(async function(err, collinfo) {
        if (!collinfo) {
            console.log("rootCategory created");
            const rootCategory = new Category({
              name: "Root Category"
            });
            await rootCategory.save();
        }
    });
 
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(cors());

    require('./passport');

    // Serve the static files from the React app
    app.use(express.static(path.join(__dirname, 'client/build')));

    var http = require('http').createServer(app);
    var io = require('socket.io')(http);
    require('./socket')(io);

    app.use('/users', users);
    app.use('/posts', posts);
    app.use('/categories', categories);

    // Handles any requests that don't match the ones above
    app.get('*', (req,res) =>{
        console.log(__dirname)
        res.sendFile(path.join(__dirname+'/../client/public/not-found.html'));
    });

    const port = process.env.PORT || 5000;
    // app.listen(port);
    // console.log('App is listening on port ' + port); 

    http.listen(port, function() {
      console.log('socket.io is listening on ' + port);
    })
});
