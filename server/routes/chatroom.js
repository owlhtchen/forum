const ChatroomController = require('../controllers/chatroom');
const express = require('express');
const router = express.Router();

router.get('/chat-record/:senderID/:receiverID', ChatroomController.getChatRecord);
router.get('/current-contact/:userID', ChatroomController.getCurrentContact);

module.exports = router;