const Post = require('../models/post');

module.exports = {
  makePost: async (req, res, next) => {
    try{
      const newPost = new Post({
        ...req.body
      });
      await newPost.save();      
      res.json({status: "Your post has been submitted"});
    } catch(err){
      next(err);
    }
  }
}