const express = require('express');
const router = express.Router();
const { getNotifications, sendNotification } = require('../controllers/notificationsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getNotifications);
router.post('/send', authMiddleware, sendNotification);

module.exports = router;
