const User = require('../models/user');
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/index');

const SignJWTToken = (user) => {
  // the claim names are only three characters long as JWT is meant to be compact.
  return JWT.sign({
    iss: 'forum',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, JWT_SECRET);
}

module.exports = {
  signUp: async (req, res, next) => {
    try {
      let user = { ...req.body };
      user.source = 'local';

      const foundUser = await User.findOne({ email : user.email});

      if(user.email && foundUser) {
        return res.json({
          error: 'email alreadly registered'
        });
      }
      const newUser = new User({
        ...user,
        source: 'local'
      });
      await newUser.save();
      const token = SignJWTToken(newUser);
      return res.json({
        token: token
      })
    } catch(err) {
      next(err);
    }
  },
  getSecret: async (req, res, next) => {
    res.json({
      secret: "Shh! This is a secret"
    });
  }
}