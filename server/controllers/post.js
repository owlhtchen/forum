const Post = require('../models/post');

module.exports = {
  makePost: async (req, res, next) => {
    try{
      const newPost = new Post({
        ...req.body
      });
      await newPost.save();      
    } catch(err){
      next(err);
    }
  }
}