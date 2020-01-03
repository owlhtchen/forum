const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usermessageSchema = new Schema({
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [String]
})

const Usermessage = mongoose.model('Usermessage', usermessageSchema);
module.exports = Usermessage;