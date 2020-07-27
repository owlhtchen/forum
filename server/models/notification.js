const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    receiverID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [{
        content: String,
        time: Date,
        read: {
            type: Boolean,
            default: false
        }
    }]
});

notificationSchema.pre("save", function (next)  {
    //
    next();
})

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;