const mongoose = require('mongoose');
const Schema = mongoose.Types.Schema;

const chatroomSchema = new Schema({
  first: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  second: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
});

const Chatroom = mongoose.model('Chatroom', chatroomSchema);
module.exports = Chatroom;