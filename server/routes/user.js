const UserController = require('../controllers/user');
var express = require('express');
var router = express.Router();
const auth = require('../utils/auth');

router.post('/signup', UserController.signUp);
router.get('/secret' , auth.isUser, UserController.getSecret);
router.post('/signin', auth.getUserFromDB, UserController.signIn);
router.post('/oauth/google', UserController.googleOauth);

router.post('/favorite', auth.isUser, UserController.favoritePost);
router.post('/cancelFavorite', auth.isUser, UserController.cancelFavoritePost);
router.get('/checkFavorite/:userID/:postID', auth.isUser, UserController.checkFavorite);
router.get('/bookmarks/:userID', auth.isUser, UserController.getBookmark);

router.get('/browse-history/:userID', auth.isUser, UserController.getBrowseHistory);
router.post('/delete-history', auth.isUser, UserController.deleteUserHistory);

router.get('/get-user/:userID', UserController.getUserByID);
router.post('/check-follow-user', UserController.checkFollowUser);
router.post('/follow-user', UserController.followUser);
router.get('/get-user-followers/:userID', UserController.getUserFollowers);
router.post('/notify-followers', UserController.notifyFollowers);
router.get('/get-notifications/:userID', UserController.getNotifications);
router.get('/get-username-with-prefix/:prefix', UserController.getUsernameWithPrefix);
router.post('/edit-bio', UserController.editBio);
router.post('/check-block-user', UserController.checkBlockUser);
router.post('/block-user', UserController.blockUser);

module.exports = router; 