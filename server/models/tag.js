const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: String,
    postIDs: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;