import axios from 'axios'

export const getUserByID = async (userID) => {
  let res = await axios.get("/users/get-user/" + userID);
  return res.data;
};

export const getPostByID = async (postID) => {
  let res = await axios.get("/posts/get-post/" + postID);
  return res.data;
};

export const getUserFollowers = async (userID) => {
  let res = await axios.get("/users/get-user-followers/" + userID);
  return res.data;
};

export const getPostFollowers = async (postID) => {
  let res = await axios.get("/posts/get-posts-followers/" + postID);
  return res.data;
};

export const notifyFollowers = async (followers, message, postID) => {
  await axios.post('/users/notify-followers', {
    followers,
    message,
    postID: postID
  });
};

export const formatDate = (date) => {
  let monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;  
};

export const dateInfo = (date) => {
  return ' on '.concat(formatDate(new Date(Date.parse(date))));
};

export const getParentPost = async (postID) => {
  let res = await axios.get('/posts/get-parent-post/' + postID);
  return res.data;
};