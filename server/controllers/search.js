const User = require('../models/user')
const Post = require('../models/post')
const Category = require('../models/category')

module.exports = {
  getSearchResultsWith: async (req, res, next) => {
    const { keyword } = req.params;
    let foundusers = await getUsernameWith(keyword);
    let foundPosts = await getPostsWith(keyword);
    res.json({
      users: foundusers,
      posts: foundPosts
    });
  }
};

const getPostsWith = async (keyword) => {
  if(keyword === '') {
    return [];
  }
  let postsWithTitleContent = await Post.find({
    "$or": [
      {title: {"$regex": keyword, "$options": "$i"}},
      {content: {"$regex": keyword, "$options": "$i"}} 
    ]
  });
  return postsWithTitleContent;
}

const getUsernameWith = async (keyword) => {
  let foundusers = await User.find({
    username: { "$regex": keyword, "$options":"$i" }
  });
  return foundusers;
}