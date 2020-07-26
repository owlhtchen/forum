const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followuserSchema = new Schema({
    followedID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    followerID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Followuser = mongoose.model('Followuser', followuserSchema);
module.exports = Followuser;