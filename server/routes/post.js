const PostController = require('../controllers/post');
const express = require('express');
const router = express.Router();

router.post('/make-post', PostController.makePost);
router.post('/filter-sorted-posts', PostController.filterSortedPosts)

module.exports = router; 