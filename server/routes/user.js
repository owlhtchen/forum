    const UserController = require('../controllers/user');
var express = require('express');
var router = express.Router();
const passport = require('passport');

router.post('/signup', UserController.signUp);
router.get('/secret', passport.authenticate('jwt', { session: false }), UserController.getSecret);
router.post('/signin', passport.authenticate('local', { session: false }), UserController.signIn);
router.post('/oauth/google', UserController.googleOauth);
router.get('/getUser/:userID', UserController.getUserByID);

module.exports = router; 