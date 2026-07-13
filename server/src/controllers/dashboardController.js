const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');
const { VEHICLE_STATUS, DRIVER_STATUS, TRIP_STATUS } = require('../constants/roles');

// @desc    Get dashboard KPIs
// @route   GET /api/dashboard/kpis
// @access  Private
const getKpis = asyncHandler(async (req, res) => {
  const [
    totalVehicles,
    activeVehicles,
    availableVehicles,
    maintenanceVehicles,
    retiredVehicles,
    driversOnDuty,
    activeTrips,
    pendingTrips,
    totalDrivers,
  ] = await Promise.all([
    Vehicle.countDocuments({ isDeleted: false }),
    Vehicle.countDocuments({ isDeleted: false, status: { $ne: VEHICLE_STATUS.RETIRED } }),
    Vehicle.countDocuments({ isDeleted: false, status: VEHICLE_STATUS.AVAILABLE }),
    Vehicle.countDocuments({ isDeleted: false, status: VEHICLE_STATUS.IN_SHOP }),
    Vehicle.countDocuments({ isDeleted: false, status: VEHICLE_STATUS.RETIRED }),
    Driver.countDocuments({ isDeleted: false, status: DRIVER_STATUS.ON_TRIP }),
    Trip.countDocuments({ status: TRIP_STATUS.DISPATCHED }),
    Trip.countDocuments({ status: TRIP_STATUS.DRAFT }),
    Driver.countDocuments({ isDeleted: false }),
  ]);

  const fleetUtilization = totalVehicles > 0 ? Math.round(((totalVehicles - availableVehicles - retiredVehicles - maintenanceVehicles + activeTrips) / totalVehicles) * 100) : 0;
  const onTripVehicles = await Vehicle.countDocuments({ isDeleted: false, status: VEHICLE_STATUS.ON_TRIP });
  const utilization = totalVehicles > 0 ? Math.round((onTripVehicles / totalVehicles) * 100) : 0;

  res.json({
    success: true,
    data: {
      totalVehicles,
      activeVehicles,
      availableVehicles,
      maintenanceVehicles,
      retiredVehicles,
      onTripVehicles,
      driversOnDuty,
      totalDrivers,
      activeTrips,
      pendingTrips,
      fleetUtilization: utilization,
    },
  });
});

// @desc    Get chart data: vehicle status distribution, monthly trips, monthly expenses, fuel consumption
// @route   GET /api/dashboard/charts
// @access  Private
const getCharts = asyncHandler(async (req, res) => {
  const [vehicleStatusAgg, monthlyTripsAgg, monthlyExpensesAgg, monthlyFuelAgg] = await Promise.all([
    Vehicle.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Trip.aggregate([
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
    Expense.aggregate([
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
    FuelLog.aggregate([
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          totalLtr: { $sum: '$quantityLtr' },
          totalCost: { $sum: '$cost' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmt = (item) => `${monthNames[item._id.month - 1]} ${item._id.year}`;

  res.json({
    success: true,
    data: {
      vehicleStatus: vehicleStatusAgg.map((v) => ({ status: v._id, count: v.count })),
      monthlyTrips: monthlyTripsAgg.map((t) => ({ month: fmt(t), count: t.count })),
      monthlyExpenses: monthlyExpensesAgg.map((e) => ({ month: fmt(e), total: Math.round(e.total) })),
      monthlyFuel: monthlyFuelAgg.map((f) => ({ month: fmt(f), liters: Math.round(f.totalLtr), cost: Math.round(f.totalCost) })),
    },
  });
});

// @desc    Get recent trips for dashboard table
// @route   GET /api/dashboard/recent-trips
// @access  Private
const getRecentTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find()
    .populate('vehicle', 'registrationNumber name')
    .populate('driver', 'name')
    .sort('-createdAt')
    .limit(8);
  res.json({ success: true, data: trips });
});

module.exports = { getKpis, getCharts, getRecentTrips };
