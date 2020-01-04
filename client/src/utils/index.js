import axios from 'axios'

export const getUserByID = async (userID) => {
  let res = await axios.get("/users/get-user/" + userID);
  return res.data;
}

export const getUserFollowers = async (userID) => {
  let res = await axios.get("/users/get-user-followers/" + userID);
  return res.data;
}

export const notifyFollowers = async (followers, message, postID) => {
  // console.log(postID);
  await axios.post('/users/notify-followers', {
    followers,
    message,
    postID: postID
  });
}

export const formatDate = (date) => {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;  
} 

export const dateInfo = (date) => {
  return ' on '.concat(formatDate(new Date(Date.parse(date))));
}

export const getParentPost = async (postID) => {
  let res = await axios.get('/posts/get-parent-post/' + postID);
  return res.data;
}