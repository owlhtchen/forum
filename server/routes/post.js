const PostController = require('../controllers/post');
const express = require('express');
const router = express.Router();

router.post('/makepost', PostController.makePost);

module.exports = router; 