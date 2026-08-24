const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, updateAnnouncement } = require('../controllers/announcementsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAnnouncements);
router.post('/', authMiddleware, createAnnouncement);
router.put('/:id', authMiddleware, updateAnnouncement);

module.exports = router;
