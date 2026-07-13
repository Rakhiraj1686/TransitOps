const express = require('express');
const router = express.Router();
const {
  getMaintenanceRecords,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { maintenanceValidator } = require('../validators/maintenanceValidator');
const { ROLES } = require('../constants/roles');

router.use(protect);

router
  .route('/')
  .get(getMaintenanceRecords)
  .post(authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER), maintenanceValidator, validate, createMaintenance);

router
  .route('/:id')
  .get(getMaintenanceById)
  .put(authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER), updateMaintenance)
  .delete(authorize(ROLES.ADMIN), deleteMaintenance);

module.exports = router;
