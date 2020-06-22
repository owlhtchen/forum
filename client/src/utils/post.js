import axios from "axios";
import axio from "axios";

export const addPost = async (postType, authorID, content, title, tagIDs) => {
    const formData = {
        postType,
        authorID,
        content,
        title,
        tagIDs,
    };
    let { data: post } = await axio.post('/posts/make-post', formData);
    return post;
}

export const addComment = async (postType, authorID, content, parentPost) => {
    let ancestorID = parentPost.ancestorID;
    let parentID = parentPost._id;
    const formData = {
      postType,
      authorID,
      content,
      ancestorID,
      parentID
    };
    let { data: post } = await axio.post('/posts/make-post', formData);
    return post;
}

export const checkUpVoted = async (userID, postID) => {
    if(!userID) {
        return false;
    }
    let {data: upVoted } = await axios.get(`/posts/checkUpVote/${userID}/${postID}`);
    return upVoted;
}

export const upVotePost = async (userID, postID, post) => {
    let formData = {
        userID,
        postID
    };
    let index = post.likedBy.indexOf(userID);
    if(index === -1) {
        post.likedBy.push(userID);
    }
    await axios.post("/posts/upVote", formData);
    return post;
}

export const cancelUpVotePost = async (userID, postID, post) => {
    let formData = {
        userID,
        postID
    };
    let index = post.likedBy.indexOf(userID);
    if(index !== -1) {
        post.likedBy.splice(index, 1);
    }
    await axios.post("/posts/cancelUpVote", formData);
    return post;
}

export const getPostByID = async (postID, depth) => {
    let res;
    if(!depth) {
        res = await axios.get("/posts/get-post/" + postID);
    } else {
        res = await axios.get(`/posts/get-post/${postID}/${depth}`);
    }
    return res.data;
};

export const getPostFollowers = async (postID) => {
    let res = await axios.get("/posts/get-posts-followers/" + postID);
    return res.data;
};

export const getParentPost = async (postID) => {
    let res = await axios.get('/posts/get-parent-post/' + postID);
    return res.data;
};

export const getArticlesByUserID = async (userID) => {
    let res = await axios.get('/posts/articles-by-userid/' + userID);
    return res.data;
}
