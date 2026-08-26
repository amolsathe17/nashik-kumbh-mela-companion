const express = require('express');
const router = express.Router();
const { login, updateProfile, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', login);
router.put('/profile', updateProfile);
router.get('/me', authMiddleware, getMe);

module.exports = router;
