const express = require('express');
const router = express.Router();
const { getLocations, createLocation, updateLocation } = require('../controllers/locationsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getLocations);
router.post('/', authMiddleware, createLocation);
router.put('/:id', authMiddleware, updateLocation);

module.exports = router;
