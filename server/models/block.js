const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  victim: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

blockSchema.index({ user: 1, victim: 1 }, { unique: true })

const Block = mongoose.model('Block', blockSchema);
module.exports = Block;