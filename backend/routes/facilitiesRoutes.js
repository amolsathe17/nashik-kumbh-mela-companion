const express = require('express');
const router = express.Router();
const { getFacilities, createFacility, updateFacility } = require('../controllers/facilitiesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getFacilities);
router.post('/', authMiddleware, createFacility);
router.put('/:id', authMiddleware, updateFacility);

module.exports = router;
