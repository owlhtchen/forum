import axios from "axios";

export const getUserByID = async (userID) => {
    let res = await axios.get("/users/get-user/" + userID);
    return res.data;
};

export const favoritePost = async (userID, postID) => {
    const formData = {
        userID,
        postID
    };
    let user = await axios.post('/users/favorite', formData);
    console.log("fav: ", user);
}

export const cancelFavoritePost = async (userID, postID) => {
    const formData = {
        userID,
        postID
    };
    let user = await axios.post('/users/cancelFavorite', formData);
    console.log("cancel fav: ", user);
}

export const checkFavorite = async (userID, postID) => {
    let res = await axios.get(`/users/checkFavorite/${userID}/${postID}`);
    console.log("check fav: ", res.data);
    return res.data;
}

export const getUserFollowers = async (userID) => {
    let res = await axios.get("/users/get-user-followers/" + userID);
    return res.data;
};

export const notifyFollowers = async (followers, message, postID) => {
    await axios.post('/users/notify-followers', {
        followers,
        message,
        postID: postID
    });
};

export const checkBlock = async (sender, receiver) => {
    try {
        let res1 = await axios.post('/users/check-block-user', {
            user: sender,
            victim: receiver
        });
        let res2 = await axios.post('/users/check-block-user', {
            user: receiver,
            victim: sender
        })
        const blocked = res1.data || res2.data;
        return blocked;
    } catch (err) {
        console.log(err);
    }
}

export const getBrowseHistory = async (userID) => {
    console.log(userID);
    let res = await axios.get('/users/browse-history/' + userID);
    return res.data;
}