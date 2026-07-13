const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { expenseValidator } = require('../validators/fuelExpenseValidator');
const { ROLES } = require('../constants/roles');

router.use(protect);

router.route('/').get(getExpenses).post(expenseValidator, validate, createExpense);
router
  .route('/:id')
  .put(updateExpense)
  .delete(authorize(ROLES.ADMIN, ROLES.FINANCIAL_ANALYST), deleteExpense);

module.exports = router;
