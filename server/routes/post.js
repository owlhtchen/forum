const PostController = require('../controllers/post');
const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');

router.post('/make-post', auth.isUser, PostController.makePost);

router.post('/filter-sorted-posts', PostController.filterSortedPosts);
router.post('/filter-following-posts', PostController.filterFollowingPosts);
router.get('/expanded-post/:postID/:userID?', PostController.viewPost);
router.get('/post-depth/:postID/:depth?', PostController.getPostDepth);

router.post('/upVote', auth.isUser, PostController.upVotePost);
router.post('/cancelUpVote', auth.isUser, PostController.cancelUpVotePost);
router.get('/checkUpVote/:userID/:postID', auth.isUser, PostController.checkUpVoted);

router.get('/get-parent-post/:postID', PostController.getParentPost);
router.get('/get-posts-followers/:postID', PostController.getPostFollowers);
router.post('/delete-post', PostController.deletePost);
router.get('/posts-by-userid/:userID', PostController.getPostsByUserID);

module.exports = router; 