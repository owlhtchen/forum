const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    password: String,
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Create a model
const Password = mongoose.model('Password', passwordSchema);
// Export the model
module.exports = Password;