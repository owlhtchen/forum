module.exports = {
    getRandomInt: (max) => {
        // TODO: user profile by 'add-user.py' not random
        return Math.floor(Math.random() * Math.floor(max));
    },
    getChatRoomName: (senderID, receiverID) => {
        senderID = senderID.toString();
        receiverID = receiverID.toString();
        let chatRoomName = "";
        if(senderID < receiverID) {
            chatRoomName = senderID + receiverID;
        } else {
            chatRoomName = receiverID + senderID;
        }
        return chatRoomName;
    },
    getOrderedChatters: (senderID, receiverID) => {
        let firstID;
        let secondID;
        if (senderID < receiverID) {
            firstID = senderID;
            secondID = receiverID;
        } else {
            firstID = receiverID;
            secondID = senderID;
        }
        return {firstID, secondID};
    }
}