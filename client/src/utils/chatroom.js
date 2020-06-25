import axios from 'axios'

export const getAllChatHistory = async (senderID, receiverID) => {
    senderID = senderID.toString();
    receiverID = receiverID.toString();
    let url = `/chat-rooms/all-chat-history/${senderID}/${receiverID}`;
    let { data: history } = await axios.get(url);
    return history;
}