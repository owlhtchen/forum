const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: String,
    createDate: {
        type: Date,
        default: Date.now
    },
    content: String,
    postType: {
        type: String,
        enum: ['story', 'post', 'comment']
    },
    authorID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentIDs: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    parentID: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    tagID: {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;