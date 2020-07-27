const NotificationController = require('../controllers/notification');
const express = require('express');
const router = express.Router();

router.post('/notify-user', NotificationController.notifyUser);
router.get('/get-notifications/:userID', NotificationController.getNotifications);

module.exports = router;