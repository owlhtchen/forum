const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { JWT_SECRET } = require('./config/index');

const User = require('./models/user');

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
        password: password
      });
      if(!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch(err) {
      return done(err, false);
    }
  }
));