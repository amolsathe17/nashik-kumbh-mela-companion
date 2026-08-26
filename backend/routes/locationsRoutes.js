const express = require('express');
const router = express.Router();
const { getLocations, createLocation, updateLocation, deleteLocation } = require('../controllers/locationsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getLocations);
router.post('/', authMiddleware, createLocation);
router.put('/:id', authMiddleware, updateLocation);
router.delete('/:id', authMiddleware, deleteLocation);

module.exports = router;
