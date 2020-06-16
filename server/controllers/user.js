const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Password = require('../models/password');
const {JWT_SECRET} = require('../config/index');
const Followuser = require('../models/followuser');
const Block = require('../models/block');
const Notification = require('../models/notification');
const usernameSingleton = require('../utils/trie');
const Post = require('../models/post');

const SignJWTToken = (user) => {
    // the claim names are only three characters long as JWT is meant to be compact.
    return jwt.sign({
        iss: 'forum',
        sub: user.id,
        isAdmin: user.isAdmin,
        isDelete: user.isDelete,
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

        const {email, name} = profileObj;
        let foundUser = await User.findOne({
            source: 'google',
            thirdPartyID: googleId
        });

        if (!foundUser) {
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
            const {user, follower} = req.body;
            const followUser = await Followuser.findOne({
                user: user,
                follower: follower
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
        const {user, follower, startFollowing} = req.body;
        try {
            if (startFollowing) {
                let newFollowuser = new Followuser({
                    user,
                    follower
                });
                await newFollowuser.save();
            } else {
                await Followuser.deleteMany({
                    user,
                    follower
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
    notifyFollowers: async (req, res, next) => {
        const {followers, message, postID} = req.body;
        try {
            await Promise.all(followers.map(async (entry) => {
                const receiver = entry.follower;
                let foundNotification = await Notification.findOne({
                    receiver: receiver
                });
                if (!foundNotification) {
                    let newNotification = new Notification({
                        receiver: receiver,
                        messages: [{
                            content: message,
                            time: new Date(),
                            postID: postID
                        }]
                    });
                    await newNotification.save();
                } else {
                    await Notification.updateMany(
                        {receiver: receiver},
                        {
                            "$push": {
                                'messages': {
                                    content: message,
                                    time: new Date(),
                                    postID: postID
                                }
                            }
                        }
                    )
                }
            }));
            res.end();
        } catch (err) {
            next(err);
        }
    },
    getNotifications: async (req, res, next) => {
        const {userID} = req.params;
        let notification = await Notification.findOne({
            receiver: userID
        });
        if (notification) {
            res.json(notification.messages);
        } else {
            res.json([]);
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
            const browseHistory = await Promise.all(user.browserHistory.map(async (postID) => {
                const post = await Post.aggregate([
                    {
                        "$match": {
                            "_id": postID
                        }
                    },
                    {
                        "$lookup": {
                            from: 'users',
                            localField: 'authorID',
                            foreignField: '_id',
                            as: "author"
                        },
                    },
                    {
                        "$lookup": {
                            from: 'tags',
                            localField: 'tagID',
                            foreignField: '_id',
                            as: 'tag'
                        }
                    }
                ]);
                return post[0];
            }));
            console.log(browseHistory);
            res.json(browseHistory);
        } catch (err) {
            next(err);
        }
    }
};