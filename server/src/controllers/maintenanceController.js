const asyncHandler = require('express-async-handler');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const ApiFeatures = require('../utils/apiFeatures');
const { VEHICLE_STATUS, MAINTENANCE_STATUS } = require('../constants/roles');

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private
const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const baseQuery = Maintenance.find().populate('vehicle', 'registrationNumber name type status');
  const features = new ApiFeatures(baseQuery, req.query).search(['issue', 'technician']).filter().sort().paginate();

  const [records, total] = await Promise.all([features.query, Maintenance.countDocuments()]);

  res.json({
    success: true,
    count: records.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: records,
  });
});

// @desc    Get single maintenance record
// @route   GET /api/maintenance/:id
// @access  Private
const getMaintenanceById = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id).populate('vehicle');
  if (!record) {
    res.status(404);
    throw new Error('Maintenance record not found');
  }
  res.json({ success: true, data: record });
});

// @desc    Create maintenance record - vehicle automatically becomes In Shop
// @route   POST /api/maintenance
// @access  Private (Admin, Fleet Manager)
const createMaintenance = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.body.vehicle, isDeleted: false });
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }
  if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
    res.status(400);
    throw new Error('Cannot log maintenance: vehicle is currently On Trip');
  }
  if (vehicle.status === VEHICLE_STATUS.RETIRED) {
    res.status(400);
    throw new Error('Cannot log maintenance: vehicle is Retired');
  }

  const record = await Maintenance.create({ ...req.body, createdBy: req.user._id });

  vehicle.status = VEHICLE_STATUS.IN_SHOP;
  await vehicle.save();

  res.status(201).json({
    success: true,
    message: 'Maintenance record created. Vehicle status set to In Shop.',
    data: record,
  });
});

// @desc    Update maintenance record status/details
// @route   PUT /api/maintenance/:id
// @access  Private (Admin, Fleet Manager)
const updateMaintenance = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) {
    res.status(404);
    throw new Error('Maintenance record not found');
  }

  const previousStatus = record.status;
  Object.assign(record, req.body);

  // Completing maintenance restores vehicle to Available (unless retired)
  if (previousStatus !== MAINTENANCE_STATUS.COMPLETED && record.status === MAINTENANCE_STATUS.COMPLETED) {
    record.completedAt = new Date();
    const vehicle = await Vehicle.findById(record.vehicle);
    if (vehicle && vehicle.status !== VEHICLE_STATUS.RETIRED) {
      vehicle.status = VEHICLE_STATUS.AVAILABLE;
      await vehicle.save();
    }
  }

  const updated = await record.save();
  res.json({ success: true, message: 'Maintenance record updated successfully', data: updated });
});

// @desc    Delete maintenance record
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin)
const deleteMaintenance = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) {
    res.status(404);
    throw new Error('Maintenance record not found');
  }
  await record.deleteOne();
  res.json({ success: true, message: 'Maintenance record deleted successfully' });
});

module.exports = {
  getMaintenanceRecords,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
