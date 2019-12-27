const express = require('express');
const path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

const users = require('./routes/user');

mongoose.connect('mongodb://localhost/forum', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to mongod");
 
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Serve the static files from the React app
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.use('/users', users);

    // An api endpoint that returns a short list of items
    app.get('/api/getList', (req,res) => {
        var list = ["item1", "item2", "item3"];
        res.json(list);
        console.log('Sent list of items');
    });

    // Handles any requests that don't match the ones above
    app.get('*', (req,res) =>{
        console.log(__dirname)
        res.sendFile(path.join(__dirname+'/../client/public/not-found.html'));
    });

    const port = process.env.PORT || 5000;
    app.listen(port);
    console.log('App is listening on port ' + port); 
});
