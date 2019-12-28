const UserController = require('../controllers/user');
var express = require('express')
var router = express.Router()

router.post('/signup', UserController.signUp);

module.exports = router; 