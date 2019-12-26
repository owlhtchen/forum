const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: String, // 'local'
  email: String, //'local'
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ['local', 'google', 'facebook']
  },
  isDelete: Boolean,
  browserHistory: [{
    date: Number,
    contents: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }]
  }]
});

// Create a model
const User = mongoose.model('user', userSchema);
// Export the model
module.exports = User;