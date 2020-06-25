const ChatroomController = require('../controllers/chatroom');
const express = require('express');
const router = express.Router();

router.get('/all-chat-history/:senderID/:receiverID', ChatroomController.getAllChatHistory);

module.exports = router;