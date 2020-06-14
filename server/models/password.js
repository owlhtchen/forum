const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    password: String,
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

passwordSchema.statics.findByUserIDPassword = async (userID, password) => {
    try {
        const user = await Password.findOne({ 'userID': userID });
        if(user && user.password === password) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        console.log("error in findByEmailPassword: ", err);
        return null;
    }
}


// Create a model
const Password = mongoose.model('Password', passwordSchema);
// Export the model
module.exports = Password;