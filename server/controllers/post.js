const User = require('../models/user');
const Post = require('../models/post');
var mongoose = require('mongoose');

module.exports = {
  makePost: async (req, res, next) => {
    try{
      const { title, content, postType, authorID, parentID } = req.body;
      const newPost = new Post({
        title,
        content,
        postType,  
        authorID,
        parentID: parentID
      });
      await newPost.save();      
      if(parentID) {
        await Post.updateOne(
          {_id: parentID},
          { $push: {
             commentIDs:  newPost.id  
          }}
        );
      }
      res.json(newPost._id);
    } catch(err){
      next(err);
    }
  },
  filterSortedPosts: async (req, res, next) => {
    const baseScore = 50;
    const upvoteDecrease = 1000 * 60 * 60 * 8;
    const { lastPost } = req.body;
    let result;
    let query = [
      
      { '$addFields' : { 
        'score': {"$add" : [
          { '$size': '$likedBy' },  // op1
          baseScore,  // op2
          {"$subtract": [0,{"$divide": [{"$subtract":[ new Date(),"$createDate" ]}, upvoteDecrease] }]} //op3
          ] }
        },
       
    }, 
    {"$sort":{"score":-1}},
    {
      $lookup: {
      from: "users",
      localField: "authorID",
      foreignField: "_id",
      as: "author"
      }
    },   
    {"$match": {"postType": "post"}},
    ];
    try {
      if(!lastPost) {
        let q1 = query.concat([{
          "$limit": 80
        }]);
        result = await Post.aggregate(q1);
      } else {
        const lastPostScore = lastPost.likedBy.length + baseScore - 
        (new Date().getTime() - Date.parse(lastPost.createDate)) / upvoteDecrease;
        let q2 = query.concat([
          {"$match":{"score" : {"$lt": lastPostScore}}},         
          {"$limit": 50}
        ]);
        result = await Post.aggregate(q2);
      }
      res.json(result);
    } catch(err) {
      next(err);
    }
  },
  viewPost: async (req, res, next) => {
    try {
      const { postID } = req.params;
      const post = await expandPost(postID);
      res.json(post);
    } catch(err) {
      next(err);
    }
  },
  upvotePost: async (req, res, next) => {
    try {
      const { userID, postID } = req.body;
      await Post.updateOne(
        {_id : postID},
        { $addToSet : {
          likedBy: userID
        } }
      );
    } catch(err) {
      next(err);
    }
  },
  cancelUpvotePost: async (req, res, next) => {
    try {
      const { userID, postID } = req.body;
      await Post.updateOne(
        { _id : postID },
        { $pull : {
          likedBy: userID
        } }
      )
    } catch(err) {
      next(err);
    }
  },
  checkUpvote: async (req, res, next) => {
    try {
      const { userID, postID } = req.body;
      const foundUpvote = await Post.find({"$and": [
        {_id : postID},
        {likedBy : { $elemMatch : {$eq: userID} }}
      ]})
      if(foundUpvote && foundUpvote.length > 0) {
        res.json({
          upvoted: true
        });
      } else {
        res.json({
          upvoted: false
        });
      }
    } catch(err) {
      next(err);
    }
  },
  getParentPost: async (req, res, next) => {
    const { postID } = req.params;
    let currentPost;
    let currentID, parentID;
    currentID = postID
    parentID = postID;
    try {
      while(parentID) {
        currentID = parentID;
        currentPost = await Post.findOne({
          _id: currentID
        });        
        parentID = currentPost.parentID;
      }
      res.json(currentID);
    } catch(err) {
      next(err);
    }
  }
}

const expandPost = async (postID) => {
  const postList = await Post.aggregate([
    {
      "$match": {"_id": mongoose.Types.ObjectId(postID)}
    },
    {
      "$lookup": {
        from: "users",
        localField: "authorID",
        foreignField: "_id",
        as: "author"
      }
    }
  ]);
  const post = postList[0];
  post.comments = [];
  if(post.commentIDs.length > 0) {
    await Promise.all(post.commentIDs.map(async (commentID) => {
      post.comments.push(await expandPost(commentID));
    }))
  }
  return post;
}