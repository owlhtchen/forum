const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followtagSchema = new Schema({
    tag: {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    },
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Followtag = mongoose.model('Followtag', followtagSchema);
module.exports = Followtag;