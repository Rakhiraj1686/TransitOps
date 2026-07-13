const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { tripValidator } = require('../validators/tripValidator');
const { ROLES } = require('../constants/roles');

router.use(protect);

router.route('/').get(getTrips).post(tripValidator, validate, createTrip);

router.route('/:id').get(getTripById).put(updateTrip).delete(authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER), deleteTrip);

router.patch('/:id/dispatch', authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DRIVER), dispatchTrip);
router.patch('/:id/complete', authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DRIVER), completeTrip);
router.patch('/:id/cancel', authorize(ROLES.ADMIN, ROLES.FLEET_MANAGER), cancelTrip);

module.exports = router;
