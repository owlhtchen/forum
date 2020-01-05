const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String, //'local'
  thirdPartyID: String,  // 'facebook' or 'google'
  username: String, 
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
  source: {
    type: String,
    enum: ['local', 'google', 'facebook']
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  browserHistory: [{
    date: Number,
    contents: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }]
  }],
  favorite: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Create a model
const User = mongoose.model('User', userSchema);
// Export the model
module.exports = User;