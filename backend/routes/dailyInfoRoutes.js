const express = require('express');
const router = express.Router();
const { getDailyInfo, getTodayInfo, createDailyInfo, updateDailyInfo } = require('../controllers/dailyInfoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getDailyInfo);
router.get('/today', getTodayInfo);
router.post('/', authMiddleware, createDailyInfo);
router.put('/:id', authMiddleware, updateDailyInfo);

module.exports = router;
