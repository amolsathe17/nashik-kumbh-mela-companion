const express = require('express');
const router = express.Router();
const { getTravelUpdates, createTravelUpdate, updateTravelUpdate } = require('../controllers/travelController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getTravelUpdates);
router.post('/', authMiddleware, createTravelUpdate);
router.put('/:id', authMiddleware, updateTravelUpdate);

module.exports = router;
