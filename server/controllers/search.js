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
  const regex = `${keyword}+`+`(?![^)]*\\))`;  // keyword is not inside a link
  // get Post with keyword in
  // title or content or top-level comment
  let foundPosts = await Post.aggregate([
    {
      "$lookup": 
      {
        from: 'posts',
        localField: 'commentIDs',
        foreignField: '_id',
        as: 'comments'
      }
    },
    {
      "$match": 
      {
        "$or": [
          {
            "title": { "$regex" : regex, "$options" : "$i" }
          },
          {
            "content": { "$regex" : regex, "$options" : "$i" }
          },
          {
            "comments.content": { "$regex" : regex, "$options" : "$i" }
          }          
        ]
      }
    },
    {
      "$match" : 
      {
        "$or": [
          {
            "postType": "post"
          },
          {
            "postType": "article"
          }
        ]
      }
    }
  ]);
  return foundPosts;
}

const getUsernameWith = async (keyword) => {
  let foundusers = await User.find({
    username: { "$regex": keyword, "$options":"$i" }
  });
  return foundusers;
}