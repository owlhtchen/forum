const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatroomSchema = new Schema({
    firstID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    secondID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    history: [{
        senderID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        receiverID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        time: {
            type: Date
        },
        read: {
            type: Boolean,
            default: false
        }
    }]
});

const Chatroom = mongoose.model('Chatroom', chatroomSchema);
module.exports = Chatroom;