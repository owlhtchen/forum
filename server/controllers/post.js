const User = require('../models/user');
const Post = require('../models/post');
const Tag = require('../models/tag');
const FollowUser = require('../models/followuser');
const NotificationController = require('./notification');
let mongoose = require('mongoose');
let ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    addPost: async (formData) => {
        const { postType, authorID, content, title, tagIDs } = formData;
        let post = new Post({
            postType, authorID, content, title, tagIDs
        });
        post = await post.save();
        post.ancestorID = post._id;
        post = await post.save();
        let promises = [];
        for(let tagID of tagIDs) {
            if(ObjectId.isValid && !ObjectId.isValid(tagID)) {
                console.log("not valid");
                return;
            }
            promises.push(Tag.findByIdAndUpdate(
                tagID,
                {$push: {postIDs: post._id}}
            ))
        }
        await Promise.all(promises);
        return post;
    },
    addComment: async (formData) => {
        const { postType, authorID, content, ancestorID, parentID } = formData;
        let ancestor = await Post.findById(ancestorID);
        let title = ancestor.title;
        let post = new Post({
            postType,
            authorID,
            content,
            ancestorID,
            parentID,
            title
        });
        post = await post.save();
        let parent = await Post.findById(parentID);
        await Post.findByIdAndUpdate(
            parent._id,
            { $push: {commentIDs: post._id}}
            );
        return post;
    },
    makePost: async (req, res, next) => {
        // postType, authorID, content, ancestorID
        // 'post': title, tagIDs
        // 'comment': parentID (title: ancestor's title)
        try {
            const { postType } = req.body;
            let post;
            switch (postType) {
                case 'post':
                    post = await module.exports.addPost(req.body);
                    break;
                case 'post-comment':
                case 'sub-comment':
                    post = await module.exports.addComment(req.body);
                    break;
                case 'story':
                    break;
                default:
                    throw 'cannot create unknown post type';
            }
            let postList = await getPostWithAuthor(post);
            post = postList[0];
            // notification
            let mentionedIDs = [];
            const regexp = RegExp(/\[@[a-zA-Z0-9\s]+\]\(\/users\/profile\/([a-zA-Z0-9]+)+\)/,'g');
            const content = post.content || "";
            const matches = content.matchAll(regexp);
            for(const match of matches) {
                mentionedIDs.push(match[1]);
            }
            const ancestor = await Post.findById(post.ancestorID);
            const messageContent = `You were mentioned in post [${ancestor.title}](/posts/expanded-post/${post.ancestorID}#${post._id})`;
            let notifyPromises = [];
            for(const mentionedID of mentionedIDs) {
                notifyPromises.push(
                    NotificationController.notifyReceiverIDContent(
                        mentionedID,
                        messageContent
                    )
                );
            }
            await Promise.all(notifyPromises);
            res.send(post);
        } catch (e) {
            next(e);
        }
    },
    viewPost: async (req, res, next) => {
        try {
            const {postID, userID} = req.params;
            if(userID) {
                await addUserHistory(userID, postID);
            }
            const post = await expandPost(postID);
            res.json(post);
        } catch (err) {
            next(err);
        }
    },
    getPostDepth: async (req, res, next) => {
        try {
            const {postID, depth} = req.params;
            let post = await expandPost(postID, depth);
            res.json(post);
        } catch (err) {
            next(err);
        }
    },
    upVotePost: async (req, res, next) => {
        try {
            const {userID, postID} = req.body;
            await Post.updateOne(
                {_id: postID},
                {
                    $addToSet: {
                        likedBy: userID
                    }
                }
            );
            res.end();
        } catch (err) {
            next(err);
        }
    },
    cancelUpVotePost: async (req, res, next) => {
        try {
            const {userID, postID} = req.body;
            await Post.updateOne(
                {_id: postID},
                {
                    $pull: {
                        likedBy: userID
                    }
                }
            );
            res.end();
        } catch (err) {
            next(err);
        }
    },
    checkUpVoted: async (req, res, next) => {
        try {
            const {userID, postID} = req.params;
            const foundUpVote = await Post.find({
                "$and": [
                    {_id: postID},
                    {likedBy: {$elemMatch: {$eq: userID}}}
                ]
            })
            if (foundUpVote && foundUpVote.length > 0) {
                res.json(true);
            } else {
                res.json(false);
            }
        } catch (err) {
            next(err);
        }
    },
    getParentPost: async (req, res, next) => {
        const {postID} = req.params;
        let currentPost;
        let currentID, parentID;
        currentID = postID
        parentID = postID;
        try {
            while (parentID) {
                currentID = parentID;
                currentPost = await Post.findOne({
                    _id: currentID
                });
                parentID = currentPost.parentID;
            }
            res.json(currentID);
        } catch (err) {
            next(err);
        }
    },
    getPostFollowers: async (req, res, next) => {
        try {
            const {postID} = req.params;
            let postFollowers = await Followpost.find(
                {post: postID}
            );
            res.json(postFollowers);
        } catch (err) {
            next(err);
        }
    },
    deletePost: async (req, res, next) => {
        const {postID, userID} = req.body;
        console.log(postID)
        try {
            const user = await User.findById(userID);
            const post = await Post.findById(postID);
            if (!user.isAdmin && (userID !== post.authorID.toString())) {
                return res.status(401).end();
            }
            let temp = await Post.updateMany(
                {_id: postID},
                {isDeleted: true}
            )
            console.log(temp)
            return res.end()
        } catch (err) {
            next(err);
        }
    },
    getPostsByUserID: async (req, res, next) => {
        const {userID} = req.params;
        try {
            let result = await Post.aggregate([
                {
                    "$match": {
                        "$and": [
                            {"authorID": mongoose.Types.ObjectId(userID)}
                        ]
                    }
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "authorID",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                {
                    "$unwind": "$author"
                },
                {
                    "$sort": {
                        createDate: -1
                    }
                }
            ]);
            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    getPostsWithAuthorTags: async (postIDs) => {
        let promises = postIDs.map(ID => {
            return Post.aggregate([
                {
                    "$match": {
                        "_id": ID
                    }
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "authorID",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                {
                    "$unwind": "$author"
                },
                {
                    "$lookup": {
                        from: "tags",
                        localField: "tagIDs",
                        foreignField: "_id",
                        as: "tags"
                    }
                }
            ])
        })
        let values = await Promise.all(promises);
        return values.map(value => {
            return value[0];
        });
    },
    filterSortedPosts: async (req, res, next) => {
        const baseScore = 50;
        const upvoteDecrease = 1000 * 60 * 60 * 8;
        const {lastPost} = req.body;
        let result;
        let query = [
            {
                '$match': {isDeleted: {'$eq': false}}
            },
            {
                "$match": {
                    "$or": [
                        {"postType": "post"},
                        {"postType": "story"},
                        // {"postType": "post-comment"}
                    ]
                }
            },
            {
                '$addFields': {
                    'score': {
                        "$add": [
                            {'$size': '$likedBy'},  // op1
                            baseScore,  // op2
                            {"$subtract": [0, {"$divide": [{"$subtract": [new Date(), "$createDate"]}, upvoteDecrease]}]} //op3
                        ]
                    }
                },

            },
            {"$sort": {"score": -1}},
            {
                $lookup: {
                    from: "users",
                    localField: "authorID",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $unwind: {
                    path: "$author"
                }
            },
            {
                $lookup: {
                    from: 'tags',
                    localField: 'tagIDs',
                    foreignField: '_id',
                    as: 'tags'
                }
            },
        ];
        try {
            if (!lastPost) {
                let q1 = query.concat([{
                    "$limit": 15
                }]);
                result = await Post.aggregate(q1);
            } else {
                const lastPostScore = lastPost.likedBy.length + baseScore -
                    (new Date().getTime() - Date.parse(lastPost.createDate)) / upvoteDecrease;
                let q2 = query.concat([
                    {"$match": {"score": {"$lt": lastPostScore}}},
                    {"$limit": 15}
                ]);
                result = await Post.aggregate(q2);
            }
            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    filterFollowingPosts: async (req, res, next) => {
        try {
            const { userID, lastPost } = req.body;
            const followings = await FollowUser.find({
                "followerID": userID
            });
            const followingIDs = followings.map(following => {
                return following.followedID
            });
            let query = [
                {
                    "$match": {
                        "authorID": { "$in": followingIDs },
                        // "postType": { "$eq": "post-comment"}
                    }
                },
                {
                  "$sort": {
                      "createDate": -1
                  }
                },
                {
                    "$lookup": {
                        from: "users",
                        localField: "authorID",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                {
                    "$unwind": {
                        path: "$author"
                    }
                },
                {
                    "$lookup": {
                        from: 'tags',
                        localField: 'tagIDs',
                        foreignField: '_id',
                        as: 'tags'
                    }
                },
            ];
            if(!lastPost) {
                query = query.concat([{
                    "$limit": 15
                }])
            } else {
                let lastDate =  new Date(new Date(lastPost.createDate).getTime() - 1000);
                query = query.concat([
                    {
                        "$match": {
                            "createDate": {
                                "$lt": lastDate
                            }
                        },
                    },
                    {
                        "$limit": 15
                    }
                ])
            }
            let followingPosts = await Post.aggregate(query);
            res.json(followingPosts);
        } catch (e) {
            next(e);
        }
    }
}

async function addUserHistory(userID, postID) {
    // if I define this in user.js and require it, this will have circular require calls
    const user = await User.findById(userID);
    if (user.browseHistory.length > 0 &&
        user.browseHistory[user.browseHistory.length - 1].toString() === postID) {
        return;
    }
    let index = user.browseHistory.findIndex(ID => { return ID.toString() === postID });
    if(index !== -1) {
        user.browseHistory.splice(index, 1);
    }
    user.browseHistory.push(postID);
    const length = user.browseHistory.length;
    user.browseHistory = user.browseHistory.slice(
        length - 150 >= 0 ? length - 150 : 0,
        length
    );
    await user.save();
}

const expandPost = async (postID, depth) => {
    // depth in [1, inf]; depth === 1: the post itself only (with no comments)
    if(depth !== undefined && depth === 0) {
        return;
    }

    const postList = await Post.aggregate([
        {
            "$match": {"_id": mongoose.Types.ObjectId(postID)}
        },
        {
            "$lookup": {
                from: "users",
                localField: "authorID",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $unwind: {
                path: "$author"
            }
        },
        {
            "$lookup": {
                from: "tags",
                localField: "tagIDs",
                foreignField: "_id",
                as: "tags"
            }
        }
    ]);
    if(depth !== undefined) {
        depth -= 1;
    }
    const post = postList[0];
    post.comments = [];
    if (post.commentIDs.length > 0) {
        for (const id of post.commentIDs) {
            post.comments.push(await expandPost(id.toString(), depth));
        }
    }
    return post;
}

const getPostWithAuthor = async (post) => {
    return Post.aggregate([
        {
            "$match": {
                "_id": post._id
            }
        },
        {
            "$lookup": {
                from: "users",
                localField: "authorID",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            "$unwind": {
                path: "$author"
            }
        }
    ])
}