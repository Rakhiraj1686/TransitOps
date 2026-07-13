const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    date: { type: Date, default: Date.now },
    quantityLtr: { type: Number, required: [true, 'Fuel quantity is required'], min: 0 },
    cost: { type: Number, required: [true, 'Fuel cost is required'], min: 0 },
    odometerAtFillUp: { type: Number },
    station: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FuelLog', fuelLogSchema);
