    const UserController = require('../controllers/user');
var express = require('express');
var router = express.Router();
const passport = require('passport');

router.post('/signup', UserController.signUp);
router.get('/secret', passport.authenticate('jwt', { session: false }), UserController.getSecret);
router.post('/signin', passport.authenticate('local', { session: false }), UserController.signIn);
router.post('/oauth/google', UserController.googleOauth);
router.get('/get-user/:userID', UserController.getUserByID);
router.post('/check-follow-user', UserController.checkFollowUser);
router.post('/follow-user', UserController.followUser);
router.get('/get-user-followers/:userID', UserController.getUserFollowers);
router.post('/notify-followers', UserController.notifyFollowers);
router.get('/get-notifications/:userID', UserController.getNotifications);
router.get('/get-username-with-prefix/:prefix', UserController.getUsernameWithPrefix);

module.exports = router; 