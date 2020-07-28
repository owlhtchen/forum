import axios from "axios";

export const getUserByID = async (userID) => {
    let res = await axios.get("/users-back/get-user/" + userID);
    return res.data;
};

export const getChatRoomName = (senderID, receiverID) => {
    senderID = senderID.toString();
    receiverID = receiverID.toString();
    let chatRoomName = "";
    if(senderID < receiverID) {
        chatRoomName = senderID + receiverID;
    } else {
        chatRoomName = receiverID + senderID;
    }
    return chatRoomName;
}

export const favoritePost = async (userID, postID) => {
    const formData = {
        userID,
        postID
    };
    await axios.post('/users-back/favorite', formData);
}

export const cancelFavoritePost = async (userID, postID) => {
    const formData = {
        userID,
        postID
    };
    await axios.post('/users-back/cancelFavorite', formData);
}

export const checkFavorite = async (userID, postID) => {
    let res = await axios.get(`/users-back/checkFavorite/${userID}/${postID}`);
    return res.data;
}

export const getUserFollowers = async (userID) => {
    let res = await axios.get("/users-back/get-user-followers/" + userID);
    return res.data;
};

export const getBrowseHistory = async (userID) => {
    let { data:browsedPosts } = await axios.get('/users-back/browse-history/' + userID);
    return browsedPosts;
}

export const getBookmarks = async (userID) => {
    let { data:bookmarks } = await axios.get('/users-back/bookmarks/' + userID);
    return bookmarks;
}

export const getUsersWithPrefix = async (prefix) => {
    if(prefix) {
        let { data } = await axios.get(`/users-back/get-username-with-prefix/${prefix}`);
        return data;
    } else {
        return [];
    }
}

export const deleteUserHistory = async (userID, postID) => {
    await axios.post('/users-back/delete-history', {
        userID,
        postID
    });
}

export const uploadUserAvatar = async (userID, userAvatar) => {
    let formData = new FormData();
    formData.append('userID', userID);
    formData.append('userAvatar', userAvatar);
    const config= {
        "headers": {
            "content-type": "multipart/form-data"
        }
    };
    await axios.post('/upload-back/avatar', formData, config);
}

export const checkFollowUser = async (followedID, followerID) => {
    let { data: following } = await axios.get(`/users-back/check-follow-user/${followedID}/${followerID}`);
    return following;
}

export const toggleFollow = async (followedID, followerID, alreadyFollowing) => {
    let formData = {
        followedID,
        followerID,
        alreadyFollowing
    };
    await axios.post('/users-back/follow-user', formData);
}

export const notifyFollowers = async (followers, message, postID) => {
    await axios.post('/users-back/notify-followers', {
        followers,
        message,
        postID: postID
    });
};

export const checkBlock = async (sender, receiver) => {
    try {
        let res1 = await axios.post('/users-back/check-block-user', {
            user: sender,
            victim: receiver
        });
        let res2 = await axios.post('/users-back/check-block-user', {
            user: receiver,
            victim: sender
        })
        const blocked = res1.data || res2.data;
        return blocked;
    } catch (err) {
        console.log(err);
    }
}
