import axios from 'axios'

export const getUserByID = async (userID) => {
  let res = await axios.get("/users/get-user/" + userID);
  return res.data;
}

export const getUserFollowers = async (userID) => {
  let res = await axios.get("/users/get-user-followers/" + userID);
  return res.data;
}

export const notifyFollowers = async (followers, message) => {
  await axios.post('/users/notify-followers', {
    followers,
    message
  });
}