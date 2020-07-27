import axios from "axios";

export const addPost = async (postType, authorID, content, title, tagIDs) => {
    const formData = {
        postType,
        authorID,
        content,
        title,
        tagIDs,
    };
    let { data: post } = await axios.post('/posts/make-post', formData);
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
    let { data: post } = await axios.post('/posts/make-post', formData);
    // This is for post.comments.map in Comment.js
    post.comments = [];
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

export const viewPost = async (postID, userID) => {
    let url = `/posts/expanded-post/${postID}/${userID ? userID : ""}`;
    let { data: post} = await axios.get(url);
    return post;
}

export const getPostDepth = async (postID, depth) => {
    let res;
    if(!depth) {
        res = await axios.get("/posts/post-depth/" + postID);
    } else {
        res = await axios.get(`/posts/post-depth/${postID}/${depth}`);
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

export const getPostsByUserID = async (userID) => {
    let res = await axios.get('/posts/posts-by-userid/' + userID);
    return res.data;
}

export const getPostTitleUrl = (post) => {
    // let isPostComment = (post.postType === "post-comment");
    // let isSubComment = (post.postType === "sub-comment");
    // let isPost = (post.postType === "post");
    let titleUrl = `/posts/expanded-post/${post.ancestorID}`;
    // if (isPostComment) {
    //     titleUrl = `/posts/expanded-post/${post.parentID}`;
    // } else if(isSubComment) {
    //     titleUrl = `/posts/expanded-post/${post.ancestorID}`;
    // } else if(isPost) {
    //     titleUrl = `/posts/expanded-post/${post._id}`;
    // }
    titleUrl += `#${post._id}`;
    return titleUrl;
}

export const getTrendingPost = async (filter) => {
    const res = await axios.post('/posts/filter-sorted-posts', filter);
    return res.data;
}

export const getFollowingPost = async (filter, userID) => {
    filter["userID"] = userID;
    const res = await axios.post('/posts/filter-following-posts', filter);
    return res.data;
}
