const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { JWT_SECRET } = require('./config/index');

const User = require('./models/user');
const Password = require('./models/password');
const opts = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: JWT_SECRET
}
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.sub);
    if(!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch(err) {
    return done(err, false);
  }
}));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    // passReqToCallback: true,
    session: false
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({
        email: username,
      });
      if(!user) {
        return done(null, false);
      }
      const user_pwd = await Password.findOne({
        userID : user.id
      });
      console.log(user_pwd);
     if(!user_pwd || user_pwd.password !== password){
       return done(null, false);
     }
      return done(null, user);
    } catch(err) {
      return done(err, false);
    }
  }
));