import axios from "axios";

export const checkUpVoted = async (userID, postID) => {
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
