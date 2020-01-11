const express = require('express');
const path = require('path');
const cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const users = require('./routes/user');
const posts = require('./routes/post');
const categories = require('./routes/category');
const uploads = require('./routes/multer');

const Category = require('./models/category');

mongoose.connect('mongodb://localhost/forum', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to mongod");

  mongoose.connection.db.listCollections({name: 'categories'})
  .next(async function(err, collinfo) {
      if (!collinfo) {
          console.log("Root Category created");
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
    app.use(express.static(path.join(__dirname, 'public/avatars')));

    let http = require('http').createServer(app);
    let io = require('socket.io')(http);
    require('./socket')(io);

    app.use('/users', users);
    app.use('/posts', posts);
    app.use('/categories', categories);
    app.use('/upload', uploads);

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
