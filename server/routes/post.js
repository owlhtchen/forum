const PostController = require('../controllers/post');
const express = require('express');
const router = express.Router();

router.post('/make-post', PostController.makePost);
router.post('/filter-sorted-posts', PostController.filterSortedPosts)
router.get('/view-post/:postID', PostController.viewPost);
router.post('/upvote', PostController.upvotePost);
router.post('/cancelUpvote', PostController.cancelUpvotePost);
router.post('/checkUpvote', PostController.checkUpvote);

module.exports = router; 