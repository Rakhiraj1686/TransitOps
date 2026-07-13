// const asyncHandler = require('express-async-handler');
// const Vehicle = require('../models/Vehicle');
// const Trip = require('../models/Trip');
// const Maintenance = require('../models/Maintenance');
// const FuelLog = require('../models/FuelLog');
// const ApiFeatures = require('../utils/apiFeatures');
// const { VEHICLE_STATUS } = require('../constants/roles');

// // @desc    Get all vehicles (search, filter, sort, paginate)
// // @route   GET /api/vehicles
// // @access  Private
// const getVehicles = asyncHandler(async (req, res) => {
//   const baseQuery = Vehicle.find({ isDeleted: false });
//   const features = new ApiFeatures(baseQuery, req.query)
//     .search(['registrationNumber', 'name'])
//     .filter()
//     .sort()
//     .paginate();

//   const [vehicles, total] = await Promise.all([
//     features.query,
//     Vehicle.countDocuments({ isDeleted: false }),
//   ]);

//   res.json({
//     success: true,
//     count: vehicles.length,
//     total,
//     page: features.pagination.page,
//     pages: Math.ceil(total / features.pagination.limit),
//     data: vehicles,
//   });
// });

// // @desc    Get single vehicle with its timeline (trips + maintenance + fuel)
// // @route   GET /api/vehicles/:id
// // @access  Private
// const getVehicleById = asyncHandler(async (req, res) => {
//   const vehicle = await Vehicle.findOne({ _id: req.params.id, isDeleted: false });
//   if (!vehicle) {
//     res.status(404);
//     throw new Error('Vehicle not found');
//   }

//   const [trips, maintenance, fuelLogs] = await Promise.all([
//     Trip.find({ vehicle: vehicle._id }).populate('driver', 'name licenseNumber').sort('-createdAt').limit(20),
//     Maintenance.find({ vehicle: vehicle._id }).sort('-createdAt').limit(20),
//     FuelLog.find({ vehicle: vehicle._id }).sort('-createdAt').limit(20),
//   ]);

//   const timeline = [
//     ...trips.map((t) => ({ type: 'trip', date: t.createdAt, data: t })),
//     ...maintenance.map((m) => ({ type: 'maintenance', date: m.createdAt, data: m })),
//     ...fuelLogs.map((f) => ({ type: 'fuel', date: f.createdAt, data: f })),
//   ].sort((a, b) => new Date(b.date) - new Date(a.date));

//   res.json({ success: true, data: { vehicle, timeline } });
// });

// // @desc    Create vehicle
// // @route   POST /api/vehicles
// // @access  Private (Admin, Fleet Manager)
// const createVehicle = asyncHandler(async (req, res) => {
//   const vehicle = await Vehicle.create(req.body);
//   res.status(201).json({ success: true, message: 'Vehicle registered successfully', data: vehicle });
// });

// // @desc    Update vehicle
// // @route   PUT /api/vehicles/:id
// // @access  Private (Admin, Fleet Manager)
// const updateVehicle = asyncHandler(async (req, res) => {
//   const vehicle = await Vehicle.findOne({ _id: req.params.id, isDeleted: false });
//   if (!vehicle) {
//     res.status(404);
//     throw new Error('Vehicle not found');
//   }

//   // Prevent manual status flips that bypass business rules while On Trip
//   if (req.body.status && vehicle.status === VEHICLE_STATUS.ON_TRIP && req.body.status !== VEHICLE_STATUS.ON_TRIP) {
//     res.status(400);
//     throw new Error('Cannot manually change status of a vehicle that is currently On Trip');
//   }

//   Object.assign(vehicle, req.body);
//   const updated = await vehicle.save();
//   res.json({ success: true, message: 'Vehicle updated successfully', data: updated });
// });

// // @desc    Soft delete vehicle
// // @route   DELETE /api/vehicles/:id
// // @access  Private (Admin)
// const deleteVehicle = asyncHandler(async (req, res) => {
//   const vehicle = await Vehicle.findOne({ _id: req.params.id, isDeleted: false });
//   if (!vehicle) {
//     res.status(404);
//     throw new Error('Vehicle not found');
//   }
//   if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
//     res.status(400);
//     throw new Error('Cannot delete a vehicle that is currently On Trip');
//   }
//   vehicle.isDeleted = true;
//   await vehicle.save();
//   res.json({ success: true, message: 'Vehicle removed successfully' });
// });

// // @desc    Get vehicles available for dispatch (Available status only, not retired/in shop)
// // @route   GET /api/vehicles/available/list
// // @access  Private
// const getAvailableVehicles = asyncHandler(async (req, res) => {
//   const vehicles = await Vehicle.find({ status: VEHICLE_STATUS.AVAILABLE, isDeleted: false }).sort('name');
//   res.json({ success: true, count: vehicles.length, data: vehicles });
// });

// module.exports = {
//   getVehicles,
//   getVehicleById,
//   createVehicle,
//   updateVehicle,
//   deleteVehicle,
//   getAvailableVehicles,
// };


const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const FuelLog = require('../models/FuelLog');
const Notification = require('../models/Notification');
const ApiFeatures = require('../utils/apiFeatures');
const { VEHICLE_STATUS } = require('../constants/roles');

const getVehicles = asyncHandler(async (req, res) => {
  const baseQuery = Vehicle.find({ isDeleted: false });

  const features = new ApiFeatures(baseQuery, req.query)
    .search(['registrationNumber', 'name'])
    .filter()
    .sort()
    .paginate();

  const [vehicles, total] = await Promise.all([
    features.query,
    Vehicle.countDocuments({ isDeleted: false }),
  ]);

  res.json({
    success: true,
    count: vehicles.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: vehicles,
  });
});

const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  const [trips, maintenance, fuelLogs] = await Promise.all([
    Trip.find({ vehicle: vehicle._id })
      .populate('driver', 'name licenseNumber')
      .sort('-createdAt')
      .limit(20),

    Maintenance.find({ vehicle: vehicle._id })
      .sort('-createdAt')
      .limit(20),

    FuelLog.find({ vehicle: vehicle._id })
      .sort('-createdAt')
      .limit(20),
  ]);

  const timeline = [
    ...trips.map((t) => ({
      type: 'trip',
      date: t.createdAt,
      data: t,
    })),
    ...maintenance.map((m) => ({
      type: 'maintenance',
      date: m.createdAt,
      data: m,
    })),
    ...fuelLogs.map((f) => ({
      type: 'fuel',
      date: f.createdAt,
      data: f,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({
    success: true,
    data: {
      vehicle,
      timeline,
    },
  });
});


const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);

  await Notification.create({
    user: req.user._id,
    title: 'Vehicle Added',
    message: `${vehicle.registrationNumber} has been registered successfully.`,
    type: 'vehicle',
  });

  res.status(201).json({
    success: true,
    message: 'Vehicle registered successfully',
    data: vehicle,
  });
});


const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  if (
    req.body.status &&
    vehicle.status === VEHICLE_STATUS.ON_TRIP &&
    req.body.status !== VEHICLE_STATUS.ON_TRIP
  ) {
    res.status(400);
    throw new Error(
      'Cannot manually change status of a vehicle that is currently On Trip'
    );
  }

  Object.assign(vehicle, req.body);

  const updated = await vehicle.save();

  await Notification.create({
    user: req.user._id,
    title: 'Vehicle Updated',
    message: `${updated.registrationNumber} details were updated.`,
    type: 'vehicle',
  });

  res.json({
    success: true,
    message: 'Vehicle updated successfully',
    data: updated,
  });
});


const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
    res.status(400);
    throw new Error(
      'Cannot delete a vehicle that is currently On Trip'
    );
  }

  vehicle.isDeleted = true;

  await vehicle.save();

  await Notification.create({
    user: req.user._id,
    title: 'Vehicle Removed',
    message: `${vehicle.registrationNumber} has been removed.`,
    type: 'vehicle',
  });

  res.json({
    success: true,
    message: 'Vehicle removed successfully',
  });
});

const getAvailableVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({
    status: VEHICLE_STATUS.AVAILABLE,
    isDeleted: false,
  }).sort('name');

  res.json({
    success: true,
    count: vehicles.length,
    data: vehicles,
  });
});

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAvailableVehicles,
};