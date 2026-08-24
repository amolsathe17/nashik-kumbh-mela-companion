const express = require('express');
const router = express.Router();
const { getAssistanceRequests, createAssistanceRequest, updateAssistanceRequest } = require('../controllers/assistanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAssistanceRequests);
router.post('/', createAssistanceRequest); // Public visitor request creation
router.put('/:id', authMiddleware, updateAssistanceRequest);

module.exports = router;
