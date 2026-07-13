const asyncHandler = require('express-async-handler');
const FuelLog = require('../models/FuelLog');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all fuel logs
// @route   GET /api/fuel
// @access  Private
const getFuelLogs = asyncHandler(async (req, res) => {
  const baseQuery = FuelLog.find().populate('vehicle', 'registrationNumber name').populate('trip', 'tripCode');
  const features = new ApiFeatures(baseQuery, req.query).filter().sort().paginate();

  const [logs, total] = await Promise.all([features.query, FuelLog.countDocuments()]);

  res.json({
    success: true,
    count: logs.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: logs,
  });
});

// @desc    Create fuel log
// @route   POST /api/fuel
// @access  Private
const createFuelLog = asyncHandler(async (req, res) => {
  const log = await FuelLog.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Fuel log recorded successfully', data: log });
});

// @desc    Update fuel log
// @route   PUT /api/fuel/:id
// @access  Private
const updateFuelLog = asyncHandler(async (req, res) => {
  const log = await FuelLog.findById(req.params.id);
  if (!log) {
    res.status(404);
    throw new Error('Fuel log not found');
  }
  Object.assign(log, req.body);
  const updated = await log.save();
  res.json({ success: true, message: 'Fuel log updated successfully', data: updated });
});

// @desc    Delete fuel log
// @route   DELETE /api/fuel/:id
// @access  Private (Admin, Fleet Manager)
const deleteFuelLog = asyncHandler(async (req, res) => {
  const log = await FuelLog.findById(req.params.id);
  if (!log) {
    res.status(404);
    throw new Error('Fuel log not found');
  }
  await log.deleteOne();
  res.json({ success: true, message: 'Fuel log deleted successfully' });
});

module.exports = { getFuelLogs, createFuelLog, updateFuelLog, deleteFuelLog };
