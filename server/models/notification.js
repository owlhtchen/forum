const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [{
    content: String,
    time: Date,
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  }]
})

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;