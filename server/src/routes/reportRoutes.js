const express = require('express');
const router = express.Router();
const { getAnalytics, exportAnalyticsCsv } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/analytics', getAnalytics);
router.get('/export/csv', exportAnalyticsCsv);

module.exports = router;
