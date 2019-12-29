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
    enum: ['column', 'timeline', 'post', 'comment']
  },
  authorID: {
    type: Schema.Types.ObjectID,
    ref: 'User'
  }
})

const Post = mongoose.model('post', postSchema);
module.exports = Post;