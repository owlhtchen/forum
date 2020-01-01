const User = require('../models/user');
const Post = require('../models/post');
var mongoose = require('mongoose');

module.exports = {
  makePost: async (req, res, next) => {
    try{
      // console.log(req.body);
      const { title, content, postType, authorID, parentPost } = req.body;
      const newPost = new Post({
        title,
        content,
        postType,  
        authorID,
        parentID: parentPost
      });
      console.log(newPost);
      await newPost.save();      
      if(parentPost) {
        // console.log(parentPost);
        await Post.update(
          {_id: parentPost},
          { $push: {
             commentIDs:  newPost.id  
          }}
        );
      }
      res.json({status: "Your post has been submitted"});
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
        // console.log(result);
      } else {
        const lastPostScore = lastPost.likedBy.length + baseScore - 
        (new Date().getTime() - Date.parse(lastPost.createDate)) / upvoteDecrease;
        let q2 = query.concat([
          {"$match":{"score" : {"$lt": lastPostScore}}},         
          {"$limit": 50}
        ]);
        result = await Post.aggregate(q2);
      }
      // console.log(result);
      res.json(result);
    } catch(err) {
      next(err);
    }
  },
  viewPost: async (req, res, next) => {
    try {
      const { postID } = req.params;
      // const post = await Post.findById(postID).populate(
      //   'authorID', 'username'); 
      // console.log(postID);
      const post = await Post.aggregate([
        {
          "$match": {"_id" : mongoose.Types.ObjectId(postID)}
        },
        {
          "$lookup": {
            from: 'users',
            localField: 'authorID',
            foreignField: '_id',
            as: 'author'
          }
        }, 
        {
          "$graphLookup": {
            from: 'posts',
            startWith: "$commentIDs",
            connectFromField: "commentIDs",
            connectToField: "_id",
            as: "comments"
          }
        }, 
        { "$unwind": {
          path: "$comments",
          preserveNullAndEmptyArrays: true
        }},
        {
          "$lookup": {
            from: 'users',
            localField: 'comments.authorID',
            foreignField: '_id',
            as: 'comments.author'
          }
        },
        { "$group": {
          "_id": "$_id",
          "content":{"$first":"$content"},
          "createDate":{"$first":"$createDate"},
          "title":{"$first":"$title"},
          "likedBy":{"$first":"$likedBy"},
          "comments": { "$push": "$comments" },
          "commentIDs": { "$push": "$commentIDs" },
          "author" : {"$first": "$author"}
        } }
      ]);
      console.log(post);
      res.json(post[0]);
    } catch(err) {
      next(err);
    }
  }
}