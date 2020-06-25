const Chatroom = require('../models/chatroom');
const { getOrderedChatters } = require('../utils/helpers');

module.exports = {
    addChatMessage: async (senderID, receiverID, content) => {
        const { firstID, secondID } = getOrderedChatters(senderID, receiverID);
        let foundUser = await Chatroom.findOne({
            firstID: firstID,
            secondID: secondID
        });
        if (foundUser) {
            await Chatroom.updateMany(
                {
                    firstID: firstID,
                    secondID: secondID
                },
                {
                    $push: {
                        history: {
                            sender: senderID,
                            content: content,
                            time: new Date()
                        }
                    }
                }
            );
        } else {
            let chatroom = new Chatroom({
                firstID: firstID,
                secondID: secondID,
                history: [{
                    sender: senderID,
                    content: content,
                    time: new Date()
                }]
            });
            await chatroom.save();
        }
    }
}