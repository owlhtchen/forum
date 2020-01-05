const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  postIDs: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;