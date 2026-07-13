const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');
const toCsv = require('../utils/toCsv');
const { TRIP_STATUS } = require('../constants/roles');

// Build a per-vehicle analytics snapshot: fuel efficiency, operational cost, ROI
const buildVehicleAnalytics = async () => {
  const vehicles = await Vehicle.find({ isDeleted: false });

  const results = await Promise.all(
    vehicles.map(async (vehicle) => {
      const [trips, fuelLogs, maintenanceRecords, expenses] = await Promise.all([
        Trip.find({ vehicle: vehicle._id, status: TRIP_STATUS.COMPLETED }),
        FuelLog.find({ vehicle: vehicle._id }),
        Maintenance.find({ vehicle: vehicle._id }),
        Expense.find({ vehicle: vehicle._id }),
      ]);

      const totalDistance = trips.reduce((sum, t) => sum + (t.actualDistanceKm || 0), 0);
      const totalFuelLtr = fuelLogs.reduce((sum, f) => sum + (f.quantityLtr || 0), 0);
      const totalFuelCost = fuelLogs.reduce((sum, f) => sum + (f.cost || 0), 0);
      const totalMaintenanceCost = maintenanceRecords.reduce((sum, m) => sum + (m.cost || 0), 0);
      const totalOtherExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      const totalRevenue = trips.reduce((sum, t) => sum + (t.revenue || 0), 0);

      const fuelEfficiency = totalFuelLtr > 0 ? +(totalDistance / totalFuelLtr).toFixed(2) : 0;
      const operationalCost = +(totalFuelCost + totalMaintenanceCost + totalOtherExpenses).toFixed(2);
      const roi = vehicle.purchaseCost > 0 ? +(((totalRevenue - operationalCost) / vehicle.purchaseCost) * 100).toFixed(2) : 0;

      return {
        vehicleId: vehicle._id,
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name,
        status: vehicle.status,
        totalTrips: trips.length,
        totalDistanceKm: totalDistance,
        fuelEfficiencyKmPerLtr: fuelEfficiency,
        totalFuelCost: +totalFuelCost.toFixed(2),
        totalMaintenanceCost: +totalMaintenanceCost.toFixed(2),
        totalOtherExpenses: +totalOtherExpenses.toFixed(2),
        operationalCost,
        totalRevenue: +totalRevenue.toFixed(2),
        roiPercent: roi,
      };
    })
  );

  return results;
};

// @desc    Get full analytics report (fleet utilization, fuel efficiency, trips summary, ROI, op cost)
// @route   GET /api/reports/analytics
// @access  Private
const getAnalytics = asyncHandler(async (req, res) => {
  const vehicleAnalytics = await buildVehicleAnalytics();

  const totalVehicles = await Vehicle.countDocuments({ isDeleted: false });
  const onTripVehicles = await Vehicle.countDocuments({ isDeleted: false, status: 'On Trip' });
  const fleetUtilization = totalVehicles > 0 ? +((onTripVehicles / totalVehicles) * 100).toFixed(2) : 0;

  const tripsSummary = await Trip.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  const maintenanceSummary = await Maintenance.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 }, totalCost: { $sum: '$cost' } } },
  ]);

  res.json({
    success: true,
    data: {
      fleetUtilization,
      vehicleAnalytics,
      tripsSummary: tripsSummary.map((t) => ({ status: t._id, count: t.count })),
      maintenanceSummary: maintenanceSummary.map((m) => ({ status: m._id, count: m.count, totalCost: m.totalCost })),
    },
  });
});

// @desc    Export vehicle analytics report as CSV
// @route   GET /api/reports/export/csv
// @access  Private
const exportAnalyticsCsv = asyncHandler(async (req, res) => {
  const vehicleAnalytics = await buildVehicleAnalytics();
  const csv = toCsv(vehicleAnalytics);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="transitops_vehicle_report.csv"');
  res.status(200).send(csv);
});

module.exports = { getAnalytics, exportAnalyticsCsv };
