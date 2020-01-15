const Category = require('../models/category');
const mongoose = require('mongoose');

module.exports = {
  getAllCategories: async (req, res, next) => {
    try {
      const allCategories = await Category.find();
      res.json(allCategories);
    } catch(err) {
      next(err);
    }
  },
  addCategory: async (req, res, next) => {
    try {
      const { name, parentID } = req.body;
      const newCategory = new Category({
        name: name,
        parentID: parentID
      });
      await newCategory.save();    
    } catch(err) {
      next(err);
    }
  },
  getCategoryByID: async (req, res, next) => {
    try {
      const { categoryID } = req.params;
      let foundCategory = await Category.aggregate([
        {
          "$match": {
            _id: mongoose.Types.ObjectId(categoryID)
          }
        },
        {
          "$lookup": {
            from: 'posts',
            localField: "postIDs",
            foreignField: '_id',
            as: "posts"
          }
        },
        {
          "$lookup": {
            from: 'users',
            localField: "posts.authorID",
            foreignField: '_id',
            as: "posts-author"
          }
        },
        {
          "$project": {
            "name" : "1",
            "posts": {
              "_id": "1",
              "likedBy": "1",
              "commentIDs": "1",
              "isDeleted": "1",
              "title": "1",
              "content": "1",
              "postType": "1",
              "authorID": "1",
              "category": "1",
              "createDate": "1",
              "author": "1"
            }
          }
        }        
      ]);
      res.json(foundCategory[0]);
    } catch(err) {
      next(err);
    }
  }
};