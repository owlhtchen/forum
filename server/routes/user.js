const UserController = require('../controllers/user');
var express = require('express');
var router = express.Router();
const passport = require('passport');

router.post('/signup', UserController.signUp);
router.get('/secret', passport.authenticate('jwt', { session: false }), UserController.getSecret);

module.exports = router; 