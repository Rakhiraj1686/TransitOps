const { body } = require('express-validator');

const maintenanceValidator = [
  body('vehicle').isMongoId().withMessage('A valid vehicle is required'),
  body('issue').trim().notEmpty().withMessage('Issue description is required'),
  body('technician').trim().notEmpty().withMessage('Technician name is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
];

module.exports = { maintenanceValidator };
