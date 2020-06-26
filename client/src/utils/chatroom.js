import axios from 'axios'

export const getChatRecord = async (senderID, receiverID) => {
    senderID = senderID.toString();
    receiverID = receiverID.toString();
    let url = `/chat-rooms/chat-record/${senderID}/${receiverID}`;
    let { data: chatRecord } = await axios.get(url);
    return chatRecord;
}

export const getAllChatHistory = async (senderID, receiverID) => {
    let chatRecord = await getChatRecord(senderID, receiverID);
    let messages;
    if(chatRecord) {
        messages = chatRecord.history;
    } else {
        messages = [];
    }
    return messages;
}

export const getCurrentContact = async (userID) => {
    let { data: chatRecords } = await  axios.get(`/chat-rooms/current-contact/${userID}`);
    return chatRecords;
}
