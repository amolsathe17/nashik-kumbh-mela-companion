const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// POST /api/upload - Upload photos or videos to Cloudinary
router.post('/', uploadController.uploadMedia);

module.exports = router;
