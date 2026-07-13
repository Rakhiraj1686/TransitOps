const express = require('express');
const router = express.Router();
const { getKpis, getCharts, getRecentTrips } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/kpis', getKpis);
router.get('/charts', getCharts);
router.get('/recent-trips', getRecentTrips);

module.exports = router;
