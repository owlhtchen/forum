const Tag = require('../models/tag');
const mongoose = require('mongoose');
const { tagNameSingleton } = require('../utils/trie');

module.exports = {
    getAllTags: async (req, res, next) => {
        try {
            const allTags = await Tag.find();
            res.json(allTags);
        } catch (err) {
            next(err);
        }
    },
    addTag: async (req, res, next) => {
        try {
            let { name } = req.body;
            name = name.toLowerCase();

            let tag = await Tag.findOne({
                name: name
            });
            if(!tag) {
                tag = new Tag({
                    name: name
                });
                tag = await tag.save();
                const trie = await tagNameSingleton.getInstance();
                trie.insertWord(tag.name, tag);
            }
            res.send(tag);
        } catch (err) {
            next(err);
        }
    },
    getTagByID: async (req, res, next) => {
        try {
            const {tagID} = req.params;
            let foundTag = await Tag.aggregate([
                {
                    "$match": {
                        _id: mongoose.Types.ObjectId(tagID)
                    }
                },
                {
                    "$lookup": {
                        from: 'posts',
                        let: {"postIDs": "$postIDs"},
                        pipeline: [
                            {"$match": {"$expr": {"$in": ["$_id", "$$postIDs"]}}},
                            {
                                "$lookup": {
                                    from: "users",
                                    let: {"authorID": "$authorID"},
                                    pipeline: [
                                        {"$match": {"$expr": {"$eq": ["$_id", "$$authorID"]}}}
                                    ],
                                    as: "author"
                                }
                            },
                            {
                                "$unwind": "$author"
                            },
                            {
                                "$unwind": "$tagIDs"
                            },
                            {
                                "$lookup": {
                                    from: "tags",
                                    let: {"tagIDs": "$tagIDs"},
                                    pipeline: [
                                        {"$match": {"$expr": {"$eq": ["$_id", "$$tagIDs"]}}}
                                    ],
                                    as: "tags"
                                }
                            },
                            {
                                "$unwind": "$tags"
                            },
                            {
                                $group: {
                                    "_id": "$_id",
                                    "ancestorID": {"$first": "$ancestorID"},
                                    "author": {"$first": "$author"},
                                    "authorID": {"$first": "$authorID"},
                                    "commentID": {"$first": "$commentID"},
                                    "content": {"$first": "$content"},
                                    "createDate": {"$first": "$createDate"},
                                    "isDeleted": {"$first": "$isDeleted"},
                                    "likedBy": {"$first": "$likedBy"},
                                    "postType": {"$first": "$postType"},
                                    "tagIDs": {"$push": "$tagIDs"},
                                    "title": {"$first": "$title"},
                                    "tags": {"$push": "$tags"},
                                }
                            }
                        ],
                        as: "posts"
                    }
                }
            ]);
            let tag = foundTag[0];
            res.json(tag);
        } catch (err) {
            next(err);
        }
    },
    getTagNameWithPrefix: async (req, res, next) => {
        try {
            const {prefix} = req.params;
            if(!prefix) {
                return res.json([]);
            }
            const decodedPrefix = decodeURI(prefix);
            const tagTrie = await tagNameSingleton.getInstance();
            let tagObjects = tagTrie.getTrie(decodedPrefix);
            res.json(tagObjects);
        } catch (err) {
            next(err);
        }
    }
};