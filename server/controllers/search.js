const User = require('../models/user')
const Post = require('../models/post')
const Tag = require('../models/tag')

module.exports = {
    getSearchResultsWith: async (req, res, next) => {
        const {keyword} = req.params;
        let foundUsers = await getUsernameWith(keyword);
        let foundPosts = await getPostsWith(keyword);
        let foundTags = await getTagsWith(keyword);
        res.json({
            users: foundUsers,
            posts: foundPosts,
            tags: foundTags
        });
    }
};

const getTagsWith = async (keyword) => {
    let foundTags = await Tag.find({
        "name": {"$regex": keyword, "$options": "$i"}
    });
    return foundTags;
}

const getPostsWith = async (keyword) => {
    if (keyword === '') {
        return [];
    }
    const regex = `${keyword}+` + `(?![^)]*\\))`;  // keyword is not inside a link
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
            "$lookup":
                {
                    from: 'users',
                    localField: 'authorID',
                    foreignField: '_id',
                    as: 'author'
                }
        },
        {
            "$unwind": "$author"
        },
        {
            "$match":
                {
                    "$or": [
                        {
                            "title": {"$regex": regex, "$options": "$i"}
                        },
                        {
                            "content": {"$regex": regex, "$options": "$i"}
                        },
                        {
                            "comments.content": {"$regex": regex, "$options": "$i"}
                        }
                    ]
                }
        },
        {
            "$match":
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
    return await User.find({
        username: {"$regex": keyword, "$options": "$i"}
    });
}