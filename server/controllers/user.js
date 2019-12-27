const User = require('../models/user');

module.exports = {
  signUp: async (req, res, next) => {
    console.log("req.body");
    console.log(req.body);
    let user = { ...req.body };
    user.source = 'local';

    const foundUser = await User.findOne({ email : user.email});

    if(foundUser) {
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