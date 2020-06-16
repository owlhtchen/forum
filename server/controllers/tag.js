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
            console.log("addTag: ", req.body);
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