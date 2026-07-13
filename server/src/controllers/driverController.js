const asyncHandler = require('express-async-handler');
const Driver = require('../models/Driver');
const ApiFeatures = require('../utils/apiFeatures');
const { DRIVER_STATUS } = require('../constants/roles');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
const getDrivers = asyncHandler(async (req, res) => {
  const baseQuery = Driver.find({ isDeleted: false });
  const features = new ApiFeatures(baseQuery, req.query)
    .search(['name', 'licenseNumber', 'phone'])
    .filter()
    .sort()
    .paginate();

  const [drivers, total] = await Promise.all([features.query, Driver.countDocuments({ isDeleted: false })]);

  res.json({
    success: true,
    count: drivers.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: drivers,
  });
});

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Private
const getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ _id: req.params.id, isDeleted: false });
  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }
  res.json({ success: true, data: driver });
});

// @desc    Create driver
// @route   POST /api/drivers
// @access  Private (Admin, Fleet Manager, Safety Officer)
const createDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.create(req.body);
  res.status(201).json({ success: true, message: 'Driver added successfully', data: driver });
});

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private (Admin, Fleet Manager, Safety Officer)
const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ _id: req.params.id, isDeleted: false });
  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }
  if (req.body.status && driver.status === DRIVER_STATUS.ON_TRIP && req.body.status !== DRIVER_STATUS.ON_TRIP) {
    res.status(400);
    throw new Error('Cannot manually change status of a driver that is currently On Trip');
  }
  Object.assign(driver, req.body);
  const updated = await driver.save();
  res.json({ success: true, message: 'Driver updated successfully', data: updated });
});

// @desc    Soft delete driver
// @route   DELETE /api/drivers/:id
// @access  Private (Admin)
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findOne({ _id: req.params.id, isDeleted: false });
  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }
  if (driver.status === DRIVER_STATUS.ON_TRIP) {
    res.status(400);
    throw new Error('Cannot delete a driver that is currently On Trip');
  }
  driver.isDeleted = true;
  await driver.save();
  res.json({ success: true, message: 'Driver removed successfully' });
});

// @desc    Get drivers available for dispatch
// @route   GET /api/drivers/available/list
// @access  Private
const getAvailableDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find({
    status: DRIVER_STATUS.AVAILABLE,
    isDeleted: false,
    licenseExpiry: { $gt: new Date() },
  }).sort('name');
  res.json({ success: true, count: drivers.length, data: drivers });
});

// @desc    Get drivers with licenses expiring within 30 days (or already expired)
// @route   GET /api/drivers/expiring/list
// @access  Private
const getExpiringLicenses = asyncHandler(async (req, res) => {
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const drivers = await Driver.find({
    isDeleted: false,
    licenseExpiry: { $lte: in30Days },
  }).sort('licenseExpiry');
  res.json({ success: true, count: drivers.length, data: drivers });
});

module.exports = {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getAvailableDrivers,
  getExpiringLicenses,
};
