const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const ApiFeatures = require('../utils/apiFeatures');
const { TRIP_STATUS, VEHICLE_STATUS, DRIVER_STATUS } = require('../constants/roles');

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
const getTrips = asyncHandler(async (req, res) => {
  const baseQuery = Trip.find().populate('vehicle', 'registrationNumber name type').populate('driver', 'name licenseNumber');
  const features = new ApiFeatures(baseQuery, req.query)
    .search(['source', 'destination', 'tripCode'])
    .filter()
    .sort()
    .paginate();

  const [trips, total] = await Promise.all([features.query, Trip.countDocuments()]);

  res.json({
    success: true,
    count: trips.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: trips,
  });
});

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate('vehicle').populate('driver').populate('createdBy', 'name email');
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  res.json({ success: true, data: trip });
});

// @desc    Create a trip (Draft)
// @route   POST /api/trips
// @access  Private
const createTrip = asyncHandler(async (req, res) => {
  const { vehicle, driver, cargoWeightKg } = req.body;

  const vehicleDoc = await Vehicle.findOne({ _id: vehicle, isDeleted: false });
  if (!vehicleDoc) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  const driverDoc = await Driver.findOne({ _id: driver, isDeleted: false });
  if (!driverDoc) {
    res.status(404);
    throw new Error('Driver not found');
  }

  if (cargoWeightKg > vehicleDoc.maxCapacityKg) {
    res.status(400);
    throw new Error(
      `Cargo weight (${cargoWeightKg}kg) exceeds vehicle maximum capacity (${vehicleDoc.maxCapacityKg}kg)`
    );
  }

  const trip = await Trip.create({ ...req.body, status: TRIP_STATUS.DRAFT, createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Trip created as Draft', data: trip });
});

// @desc    Update a Draft trip
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.status !== TRIP_STATUS.DRAFT) {
    res.status(400);
    throw new Error('Only Draft trips can be edited. Dispatched or completed trips are locked.');
  }

  if (req.body.cargoWeightKg || req.body.vehicle) {
    const vehicleId = req.body.vehicle || trip.vehicle;
    const vehicleDoc = await Vehicle.findById(vehicleId);
    const cargo = req.body.cargoWeightKg || trip.cargoWeightKg;
    if (vehicleDoc && cargo > vehicleDoc.maxCapacityKg) {
      res.status(400);
      throw new Error(`Cargo weight (${cargo}kg) exceeds vehicle maximum capacity (${vehicleDoc.maxCapacityKg}kg)`);
    }
  }

  Object.assign(trip, req.body);
  const updated = await trip.save();
  res.json({ success: true, message: 'Trip updated successfully', data: updated });
});

// @desc    Dispatch a trip - validates ALL business rules, then flips vehicle & driver to On Trip
// @route   PATCH /api/trips/:id/dispatch
// @access  Private (Admin, Fleet Manager, Driver)
const dispatchTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.status !== TRIP_STATUS.DRAFT) {
    res.status(400);
    throw new Error(`Only Draft trips can be dispatched. Current status: ${trip.status}`);
  }

  const vehicle = await Vehicle.findById(trip.vehicle);
  const driver = await Driver.findById(trip.driver);

  if (!vehicle || vehicle.isDeleted) {
    res.status(404);
    throw new Error('Vehicle not found');
  }
  if (!driver || driver.isDeleted) {
    res.status(404);
    throw new Error('Driver not found');
  }

  // --- Business Rule Validation (all must pass) ---
  if (vehicle.status === VEHICLE_STATUS.RETIRED) {
    res.status(400);
    throw new Error('Cannot dispatch: vehicle is Retired');
  }
  if (vehicle.status === VEHICLE_STATUS.IN_SHOP) {
    res.status(400);
    throw new Error('Cannot dispatch: vehicle is In Shop for maintenance');
  }
  if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
    res.status(400);
    throw new Error('Cannot dispatch: vehicle is already On Trip');
  }
  if (driver.status === DRIVER_STATUS.SUSPENDED) {
    res.status(400);
    throw new Error('Cannot dispatch: driver is Suspended');
  }
  if (driver.status === DRIVER_STATUS.ON_TRIP) {
    res.status(400);
    throw new Error('Cannot dispatch: driver is already On Trip');
  }
  if (driver.licenseExpiry < new Date()) {
    res.status(400);
    throw new Error('Cannot dispatch: driver license has expired');
  }
  if (trip.cargoWeightKg > vehicle.maxCapacityKg) {
    res.status(400);
    throw new Error(`Cannot dispatch: cargo weight (${trip.cargoWeightKg}kg) exceeds vehicle capacity (${vehicle.maxCapacityKg}kg)`);
  }

  // --- All rules passed: perform atomic-ish transition ---
  vehicle.status = VEHICLE_STATUS.ON_TRIP;
  driver.status = DRIVER_STATUS.ON_TRIP;
  trip.status = TRIP_STATUS.DISPATCHED;
  trip.dispatchedAt = new Date();

  await Promise.all([vehicle.save(), driver.save(), trip.save()]);

  res.json({ success: true, message: 'Trip dispatched successfully', data: trip });
});

// @desc    Complete a dispatched trip
// @route   PATCH /api/trips/:id/complete
// @access  Private (Admin, Fleet Manager, Driver)
const completeTrip = asyncHandler(async (req, res) => {
  const { endOdometer, fuelConsumedLtr, actualDistanceKm, revenue } = req.body;

  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.status !== TRIP_STATUS.DISPATCHED) {
    res.status(400);
    throw new Error(`Only Dispatched trips can be completed. Current status: ${trip.status}`);
  }

  const vehicle = await Vehicle.findById(trip.vehicle);
  const driver = await Driver.findById(trip.driver);

  trip.status = TRIP_STATUS.COMPLETED;
  trip.completedAt = new Date();
  if (endOdometer !== undefined) trip.endOdometer = endOdometer;
  if (fuelConsumedLtr !== undefined) trip.fuelConsumedLtr = fuelConsumedLtr;
  if (actualDistanceKm !== undefined) trip.actualDistanceKm = actualDistanceKm;
  if (revenue !== undefined) trip.revenue = revenue;

  if (vehicle) {
    vehicle.status = VEHICLE_STATUS.AVAILABLE;
    if (endOdometer && endOdometer > vehicle.odometer) vehicle.odometer = endOdometer;
    await vehicle.save();
  }
  if (driver) {
    driver.status = DRIVER_STATUS.AVAILABLE;
    await driver.save();
  }

  await trip.save();
  res.json({ success: true, message: 'Trip completed successfully', data: trip });
});

// @desc    Cancel a Draft or Dispatched trip
// @route   PATCH /api/trips/:id/cancel
// @access  Private (Admin, Fleet Manager)
const cancelTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (![TRIP_STATUS.DRAFT, TRIP_STATUS.DISPATCHED].includes(trip.status)) {
    res.status(400);
    throw new Error(`Cannot cancel a trip that is ${trip.status}`);
  }

  const wasDispatched = trip.status === TRIP_STATUS.DISPATCHED;

  trip.status = TRIP_STATUS.CANCELLED;
  trip.cancelledAt = new Date();
  trip.cancelReason = req.body.cancelReason || 'No reason provided';

  if (wasDispatched) {
    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);
    if (vehicle && vehicle.status === VEHICLE_STATUS.ON_TRIP) {
      vehicle.status = VEHICLE_STATUS.AVAILABLE;
      await vehicle.save();
    }
    if (driver && driver.status === DRIVER_STATUS.ON_TRIP) {
      driver.status = DRIVER_STATUS.AVAILABLE;
      await driver.save();
    }
  }

  await trip.save();
  res.json({ success: true, message: 'Trip cancelled successfully', data: trip });
});

// @desc    Delete a Draft trip only
// @route   DELETE /api/trips/:id
// @access  Private (Admin)
const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.status !== TRIP_STATUS.DRAFT) {
    res.status(400);
    throw new Error('Only Draft trips can be deleted');
  }
  await trip.deleteOne();
  res.json({ success: true, message: 'Trip deleted successfully' });
});

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  deleteTrip,
};
