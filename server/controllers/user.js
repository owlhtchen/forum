const User = require('../models/user');

module.exports = {
  signUp: async (req, res, next) => {
    let user = { ...req.body };
    user.source = 'local';

    const foundUser = await User.findOne({ email : user.email});

    if(user.email && foundUser) {
      return res.send('failed');
    }
    const newUser = new User({
      ...user,
      source: 'local'
    });
    await newUser.save();

    return res.send('success');
  } 
}