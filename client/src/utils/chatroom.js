import axios from 'axios'

export const getChatRecord = async (senderID, receiverID) => {
    senderID = senderID.toString();
    receiverID = receiverID.toString();
    let url = `/chat-rooms-back/chat-record/${senderID}/${receiverID}`;
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
    let { data: chatRecords } = await  axios.get(`/chat-rooms-back/current-contact/${userID}`);
    return chatRecords;
}

export const markAsRead = async (myID, otherID) => {
    const timestamp = new Date();
    await axios.post('/chat-rooms-back/mark-as-read', {
        myID,
        otherID,
        timestamp
    })
}
