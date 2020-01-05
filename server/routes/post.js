const PostController = require('../controllers/post');
const express = require('express');
const router = express.Router();

router.post('/make-post', PostController.makePost);
router.post('/filter-sorted-posts', PostController.filterSortedPosts)
router.get('/view-post/:postID', PostController.viewPost);
router.post('/upvote', PostController.upvotePost);
router.post('/cancelUpvote', PostController.cancelUpvotePost);
router.post('/checkUpvote', PostController.checkUpvote);
router.get('/get-parent-post/:postID', PostController.getParentPost);
router.post('/follow-post', PostController.followPost);
router.post('/check-follow-post', PostController.checkFollowPost);
router.get('/get-posts-followers/:postID', PostController.getPostFollowers);
router.get('/get-post/:postID', PostController.getPostByID);
router.post('/delete-post', PostController.deletePost);

module.exports = router; 