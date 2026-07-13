const express = require('express');
const router = express.Router();
const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getAvailableDrivers,
  getExpiringLicenses,
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { driverValidator } = require('../validators/driverValidator');
const { ROLES } = require('../constants/roles');

router.use(protect);

router.get('/available/list', getAvailableDrivers);
router.get('/expiring/list', getExpiringLicenses);

router
  .route('/')
  .get(getDrivers)
  .post(authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), driverValidator, validate, createDriver);

router
  .route('/:id')
  .get(getDriverById)
  .put(authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), updateDriver)
  .delete(authorize(ROLES.ADMIN), deleteDriver);

module.exports = router;
