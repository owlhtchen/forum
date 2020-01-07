const categorySingleton = require('../utils/trie');
const Category = require('../models/category')

module.exports = {
  getCategoryWithPrefix: async (req, res, next) => {
    try {
      const { prefix } = req.params;
      const categoryTrie = await categorySingleton.getInstance();
      categoryTrie.getTrie(prefix);
    } catch(err) {
      next(err);
    }
  },
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
  }
};