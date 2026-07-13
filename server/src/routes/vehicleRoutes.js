const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAvailableVehicles,
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { vehicleValidator } = require('../validators/vehicleValidator');
const { ROLES } = require('../constants/roles');

router.use(protect);

router.get('/available/list', getAvailableVehicles);
router
  .route('/')
  .get(getVehicles)
  .post(authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER), vehicleValidator, validate, createVehicle);

router
  .route('/:id')
  .get(getVehicleById)
  .put(authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER), updateVehicle)
  .delete(authorize(ROLES.ADMIN), deleteVehicle);

module.exports = router;
