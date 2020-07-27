const Notification = require('../models/notification');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    getNotifications: async (req, res, next) => {
        const {userID} = req.params;
        let notification = await Notification.findOne({
            receiverID: userID
        });
        if (notification) {
            res.json(notification.messages);
        } else {
            res.json([]);
        }
    },
    notifyUser: async (req, res, next) => {
        const { receiverID, content } = req.body;
        try {
            await module.exports.notifyReceiverIDContent(receiverID, content);
            res.end();
        } catch (err) {
            next(err);
        }
    },
    notifyReceiverIDContent: async (receiverID, content) => {
        let foundNotification = await Notification.findOne({
            receiverID
        });
        if (!foundNotification) {
            foundNotification = new Notification({
                receiverID,
                messages: [{
                    content,
                    time: new Date(),
                }]
            });
        } else {
            foundNotification.messages.push({
                content,
                time: new Date()
            })
        }
        await foundNotification.save();
    }
}