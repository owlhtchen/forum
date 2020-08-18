const Chatroom = require('../models/chatroom');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    addChatMessage: async (senderID, receiverID, content) => {
        const { firstID, secondID } = module.exports.getOrderedChatters(senderID, receiverID);
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
                            receiverID: receiverID,
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
                    receiverID: receiverID,
                    content: content,
                    time: new Date()
                }]
            });
            await foundChat.save();
        }
        return foundChat;
    },
    getChatRecord: async (req, res, next) => {
        const { senderID, receiverID } = req.params;
        const { firstID, secondID } = module.exports.getOrderedChatters(senderID, receiverID);
        try {
            let foundChat = await Chatroom.findOne(
                {
                    "firstID": ObjectId(firstID),
                    "secondID": ObjectId(secondID)
                }
            );
            res.json(foundChat);
        } catch (e) {
            next(e);
        }
    },
    getCurrentContact: async (req, res, next) => {
        let { userID } = req.params;
        userID = ObjectId(userID);
        let chatRecords = await Chatroom.aggregate([
            {
                "$match": {
                    "$or": [
                        { "firstID": userID },
                        { "secondID": userID }
                    ]
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "firstID": 1,
                    "secondID": 1,
                    "history": 1,
                    "unreadMsg": {
                        "$size": {
                            "$filter": {
                                input: "$history",
                                as: "record",
                                cond: { "$and": [
                                        { "$ne": ["$$record.senderID", userID] },
                                        { "$eq": ["$$record.read", false]}
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                "$lookup": {
                    from: "users",
                    localField: "firstID",
                    foreignField: "_id",
                    as: "first"
                }
            },
            {
                "$unwind": "$first"
            },
            {
                "$lookup": {
                    from: "users",
                    localField: "secondID",
                    foreignField: "_id",
                    as: "second"
                }
            },
            {
                "$unwind": "$second"
            },
        ]);
        res.json(chatRecords);
    },
    markAsRead: async (req, res, next) => {
        let { myID, otherID, timestamp } = req.body;
        timestamp = new Date(timestamp);
        let { firstID, secondID } = module.exports.getOrderedChatters(myID, otherID);
        await Chatroom.updateMany(
            {
                "firstID": firstID,
                "secondID": secondID,
                "history.time": {
                    $lte: timestamp
                },
                "history.senderID": otherID
            },
            {
                $set: {
                    "history.$[].read": true
                }
            }
        )
        res.end();
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