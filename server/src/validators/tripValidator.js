const { body } = require('express-validator');

const tripValidator = [
  body('source').trim().notEmpty().withMessage('Source is required'),
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('vehicle').isMongoId().withMessage('A valid vehicle is required'),
  body('driver').isMongoId().withMessage('A valid driver is required'),
  body('cargoWeightKg').isFloat({ min: 0 }).withMessage('Cargo weight must be a positive number'),
  body('plannedDistanceKm').isFloat({ min: 0 }).withMessage('Planned distance must be a positive number'),
];

module.exports = { tripValidator };
