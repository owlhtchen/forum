const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followuserSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Followuser = mongoose.model('Followuser', followuserSchema);
module.exports = Followuser;