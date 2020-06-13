const Category = require('../models/category');
const mongoose = require('mongoose');

module.exports = {
    getAllCategories: async (req, res, next) => {
        try {
            const allCategories = await Category.find();
            res.json(allCategories);
        } catch (err) {
            next(err);
        }
    },
    addCategory: async (req, res, next) => {
        try {
            const {name, parentID} = req.body;
            const newCategory = new Category({
                name: name,
                parentID: parentID
            });
            await newCategory.save();
        } catch (err) {
            next(err);
        }
    },
    getCategoryByID: async (req, res, next) => {
        try {
            const {categoryID} = req.params;
            let foundCategory = await Category.aggregate([
                {
                    "$match": {
                        _id: mongoose.Types.ObjectId(categoryID)
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
            console.log(JSON.stringify(foundCategory[0]));
            res.json(foundCategory[0]);
        } catch (err) {
            next(err);
        }
    }
};