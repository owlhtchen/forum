import axios from "axios";

export const getNotifications = async (userID) => {
    let { data } = await axios.get(`/notifications/get-notifications/${userID}`);
    return data;
}