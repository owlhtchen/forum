const PostController = require('../controllers/post');
const express = require('express');
const router = express.Router();

router.post('/make-post', PostController.makePost);
router.post('/filter-sorted-posts', PostController.filterSortedPosts)
router.get('/expanded-post/:postID/:userID?', PostController.viewPost);
router.get('/get-post/:postID/:depth?', PostController.getPostByID);
router.post('/upVote', PostController.upVotePost);
router.post('/cancelUpVote', PostController.cancelUpVotePost);
router.get('/checkUpVote/:userID/:postID', PostController.checkUpVoted);
router.get('/get-parent-post/:postID', PostController.getParentPost);
router.post('/follow-post', PostController.followPost);
router.post('/check-follow-post', PostController.checkFollowPost);
router.get('/get-posts-followers/:postID', PostController.getPostFollowers);
router.post('/delete-post', PostController.deletePost);
router.get('/articles-by-userid/:userID', PostController.getArticlesByUserID);

module.exports = router; 