const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followpostSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Followpost = mongoose.model('Followpost', followpostSchema);
module.exports = Followpost;