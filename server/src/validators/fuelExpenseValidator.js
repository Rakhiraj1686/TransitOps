const { body } = require('express-validator');

const fuelLogValidator = [
  body('vehicle').isMongoId().withMessage('A valid vehicle is required'),
  body('quantityLtr').isFloat({ min: 0 }).withMessage('Fuel quantity must be a positive number'),
  body('cost').isFloat({ min: 0 }).withMessage('Fuel cost must be a positive number'),
];

const expenseValidator = [
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
];

module.exports = { fuelLogValidator, expenseValidator };
