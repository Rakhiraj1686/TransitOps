const express = require('express');
const router = express.Router();
const { getFuelLogs, createFuelLog, updateFuelLog, deleteFuelLog } = require('../controllers/fuelController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { fuelLogValidator } = require('../validators/fuelExpenseValidator');
const { ROLES } = require('../constants/roles');

router.use(protect);

router.route('/').get(getFuelLogs).post(fuelLogValidator, validate, createFuelLog);
router
  .route('/:id')
  .put(updateFuelLog)
  .delete(authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER), deleteFuelLog);

module.exports = router;
