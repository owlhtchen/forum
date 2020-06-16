const Tag = require('../models/tag');
const mongoose = require('mongoose');

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
            const {name, parentID} = req.body;
            const newTag = new Tag({
                name: name,
                parentID: parentID
            });
            await newTag.save();
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
                            }
                        ],
                        as: "posts"
                    }
                }
            ]);
            console.log(JSON.stringify(foundTag[0]));
            res.json(foundTag[0]);
        } catch (err) {
            next(err);
        }
    }
};