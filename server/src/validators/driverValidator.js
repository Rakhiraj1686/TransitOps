const { body } = require('express-validator');

const driverValidator = [
  body('name').trim().notEmpty().withMessage('Driver name is required'),
  body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
  body('licenseCategory')
    .isIn(['LMV', 'HMV', 'HGMV', 'HPMV', 'Trailer', 'Motorcycle'])
    .withMessage('Invalid license category'),
  body('licenseExpiry').isISO8601().withMessage('A valid license expiry date is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
];

module.exports = { driverValidator };
