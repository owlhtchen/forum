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
       
    }, {"$sort":{"score":-1}}
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
  }
}