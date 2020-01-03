const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatroomSchema = new Schema({
  first: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  second: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  history: [{
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    time: {
      type: Date
    }
  }]
});

const Chatroom = mongoose.model('Chatroom', chatroomSchema);
module.exports = Chatroom;