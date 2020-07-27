const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Password = require('../models/password');
const {JWT_SECRET} = require('../config/index');
const Followuser = require('../models/followuser');
const Block = require('../models/block');
const { usernameSingleton } = require('../utils/trie');
const Post = require('../models/post');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { getPostsWithAuthorTags } = require('./post');
const NotificationController = require('./notification');

const SignJWTToken = (user) => {
    // the claim names are only three characters long as JWT is meant to be compact.
    return jwt.sign({
        iss: 'forum',
        sub: user.id,
        isAdmin: user.isAdmin,
        isDeleted: user.isDeleted,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
};

module.exports = {
    signIn: (req, res, next) => {
        const token = SignJWTToken(res.locals.user);
        return res.json({
            token: token,
            userID: res.locals.user.id,
            isAdmin: res.locals.user.isAdmin
        });
    },
    signUp: async (req, res, next) => {
        try {
            let user = {...req.body};
            user.source = 'local';

            const foundUser = await User.findOne({email: user.email});

            if (user.email && foundUser) {
                return res.json({
                    errorMsg: 'email already registered'
                });
            }
            const password = user.password;
            user.password = undefined;
            const newUser = new User({
                ...user,
                source: 'local'
            });
            const pwd = new Password({
                userID: newUser.id,
                password: password
            });
            await newUser.save();
            await pwd.save();
            const trie = await usernameSingleton.getInstance();
            trie.insertWord(newUser.username, newUser);
            const token = SignJWTToken(newUser);
            return res.json({
                token: token,
                userID: newUser.id,
                isAdmin: newUser.isAdmin
            })
        } catch (err) {
            next(err);
        }
    },
    getSecret: async (req, res, next) => {
        res.json({
            secret: "Shh! This is a secret"
        });
    },
    googleOauth: async (req, res, next) => {
        const {googleId, profileObj} = req.body;
        if (!googleId || !profileObj) {
            return res.json({
                errorMsg: "google login failed"
            });
        }

        let {email, name} = profileObj;
        let foundUser = await User.findOne({
            source: 'google',
            thirdPartyID: googleId
        });
        if (!foundUser) {
            // name = name.replace(/\W/g, '_');
            foundUser = new User({
                email: email,
                thirdPartyID: googleId,
                username: name,
                source: 'google'
            })
            await foundUser.save();
        }

        const token = SignJWTToken(foundUser);
        return res.json({
            token: token,
            userID: foundUser.id,
            isAdmin: foundUser.isAdmin
        });
    },
    favoritePost: async (req, res, next) => {
        try {
            const {userID, postID} = req.body;
            let user = await User.findByIdAndUpdate(
                userID,
                {
                    "$addToSet": {
                        "favorite": postID
                    }
                }
            );
            res.json(user);
        } catch (e) {
            next(e);
        }
    },
    cancelFavoritePost: async (req, res, next) => {
        try {
            const {userID, postID} = req.body;
            let user = await User.findByIdAndUpdate(
                userID,
                {
                    "$pull": {
                        "favorite": postID
                    }
                }
            );
            res.json(user);
        } catch (e) {
            next(e);
        }
    },
    checkFavorite: async (req, res, next) => {
        const { userID, postID } = req.params;
        try {
            const foundUser = await User.findOne({
               "_id":  ObjectId(userID),
                "favorite": postID
            });
            if(foundUser) {
                console.log(foundUser);
                res.json(true);
            } else {
                res.json(false);
            }
        } catch (e) {
            next(e);
        }
    },
    getUserByID: async (req, res, next) => {
        try {
            const {userID} = req.params;
            const user = await User.findById(userID);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },
    checkFollowUser: async (req, res, next) => {
        try {
            const {followedID, followerID} = req.params;
            const followUser = await Followuser.findOne({
                followedID,
                followerID
            });
            if (followUser) {
                return res.json(true);
            } else {
                return res.json(false);
            }
        } catch (err) {
            next(err);
        }
    },
    followUser: async (req, res, next) => {
        const {followedID, followerID, alreadyFollowing} = req.body;
        try {
            if (!alreadyFollowing) {
                let newFollowuser = new Followuser({
                    followedID,
                    followerID
                });
                await newFollowuser.save();
                let follower = await User.findById(followerID);
                await NotificationController.notifyReceiverIDContent(followedID,
                    `[@${follower.username}](/users/profile/${follower._id}) follows you`);
            } else {
                await Followuser.deleteMany({
                    followedID,
                    followerID
                });
            }
            res.end();
        } catch (err) {
            next(err);
        }
    },
    getUserFollowers: async (req, res, next) => {
        try {
            const {userID} = req.params;
            let userFollowers = await Followuser.find(
                {user: userID}
            );
            res.json(userFollowers);
        } catch (err) {
            next(err);
        }
    },
    getUsernameWithPrefix: async (req, res, next) => {
        try {
            const {prefix} = req.params;
            const decodedPrefix = decodeURI(prefix);
            const usernameTrie = await usernameSingleton.getInstance();
            let userObjects = usernameTrie.getTrie(decodedPrefix);
            res.json(userObjects);
        } catch (err) {
            next(err);
        }
    },
    editBio: async (req, res, next) => {
        const {userID, bio} = req.body;
        await User.updateOne(
            {_id: userID},
            {bio: bio}
        );
        res.end();
    },
    checkBlockUser: async (req, res, next) => {
        const {user, victim} = req.body;
        try {
            const block = await Block.findOne({
                user: user,
                victim: victim
            });
            if (block) {
                res.json(true);
            } else {
                res.json(false);
            }
        } catch (err) {
            next(err);
        }
    },
    blockUser: async (req, res, next) => {
        const {user, victim, startBlocking} = req.body;
        try {
            if (startBlocking) {
                let block = new Block({
                    user: user,
                    victim: victim
                });
                await block.save();
                await Followuser.deleteMany({
                    user: victim,
                    follower: user
                });
            } else {
                await Block.deleteMany({
                    user: user,
                    victim: victim
                });
            }
            res.end();
        } catch (err) {
            next(err);
        }
    },
    getBrowseHistory: async (req, res, next) => {
        try {
            const {userID} = req.params;
            const user = await User.findById(userID);
            const browsedIDs = user.browseHistory;
            let browsedPosts = await getPostsWithAuthorTags(browsedIDs);
            res.json(browsedPosts);
        } catch (err) {
            next(err);
        }
    },
    getBookmark: async (req, res, next) => {
        try {
            const { userID } = req.params;
            const user = await User.findById(userID);
            const bookmarkIDs = user.favorite;
            let bookmarkPosts = await getPostsWithAuthorTags(bookmarkIDs);
            res.json(bookmarkPosts)
        } catch (e) {
            next(e);
        }
    },
    deleteUserHistory: async (req, res, next) => {
        const { userID, postID } = req.body;
        let user;
        try {
            user = await User.findById(userID);
            let index = user.browseHistory.findIndex(ID => { return ID.toString() === postID });
            if(index !== -1) {
                user.browseHistory.splice(index, 1);
            }
            await user.save();
        } catch (e) {
            console.log(e);
        }
        res.end();
    }
};