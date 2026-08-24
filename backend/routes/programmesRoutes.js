const express = require('express');
const router = express.Router();
const { getProgrammes, createProgram, updateProgram } = require('../controllers/programmesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getProgrammes);
router.post('/', authMiddleware, createProgram);
router.put('/:id', authMiddleware, updateProgram);

module.exports = router;
