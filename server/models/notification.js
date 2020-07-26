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
        postID: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        read: {
            type: Boolean,
            default: false
        }
    }]
})

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;