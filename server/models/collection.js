const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  authorID: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  articleID: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
})

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;