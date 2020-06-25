const Chatroom = require('../models/chatroom');
const { getOrderedChatters } = require('../utils/helpers');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    addChatMessage: async (senderID, receiverID, content) => {
        const { firstID, secondID } = getOrderedChatters(senderID, receiverID);
        let foundChat = await Chatroom.findOne({
            firstID: firstID,
            secondID: secondID
        });
        if (foundChat) {
            foundChat = await Chatroom.findOneAndUpdate(
                {
                    firstID: firstID,
                    secondID: secondID
                },
                {
                    $push: {
                        history: {
                            senderID: senderID,
                            content: content,
                            time: new Date()
                        }
                    }
                },
                { new: true }
            );
        } else {
            foundChat = new Chatroom({
                firstID: firstID,
                secondID: secondID,
                history: [{
                    senderID: senderID,
                    content: content,
                    time: new Date()
                }]
            });
            await foundChat.save();
        }
        return foundChat;
    },
    getAllChatHistory: async (req, res, next) => {
        const { senderID, receiverID } = req.params;
        const { firstID, secondID } = getOrderedChatters(senderID, receiverID);
        try {
            let foundChat = await Chatroom.findOne(
                {
                    "firstID": ObjectId(firstID),
                    "secondID": ObjectId(secondID)
                }
            );
            let history = foundChat ? foundChat.history : [];
            res.json(history);
        } catch (e) {
            next(e);
        }
    }
}