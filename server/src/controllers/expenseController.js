const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const baseQuery = Expense.find().populate('vehicle', 'registrationNumber name');
  const features = new ApiFeatures(baseQuery, req.query).search(['description']).filter().sort().paginate();

  const [expenses, total] = await Promise.all([features.query, Expense.countDocuments()]);

  res.json({
    success: true,
    count: expenses.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: expenses,
  });
});

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Expense recorded successfully', data: expense });
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  Object.assign(expense, req.body);
  const updated = await expense.save();
  res.json({ success: true, message: 'Expense updated successfully', data: updated });
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (Admin, Financial Analyst)
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  await expense.deleteOne();
  res.json({ success: true, message: 'Expense deleted successfully' });
});

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
