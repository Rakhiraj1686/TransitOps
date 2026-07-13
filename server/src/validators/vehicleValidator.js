const { body } = require('express-validator');

const vehicleValidator = [
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('name').trim().notEmpty().withMessage('Vehicle name is required'),
  body('type')
    .isIn(['Truck', 'Van', 'Mini Truck', 'Trailer', 'Bus', 'Pickup', 'Container Truck'])
    .withMessage('Invalid vehicle type'),
  body('maxCapacityKg').isFloat({ min: 1 }).withMessage('Maximum capacity must be greater than 0'),
  body('purchaseCost').isFloat({ min: 0 }).withMessage('Purchase cost must be a positive number'),
];

module.exports = { vehicleValidator };
