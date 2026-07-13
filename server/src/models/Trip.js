const mongoose = require('mongoose');
const { TRIP_STATUS } = require('../constants/roles');

const tripSchema = new mongoose.Schema(
  {
    tripCode: { type: String, unique: true },
    source: { type: String, required: [true, 'Source is required'], trim: true },
    destination: { type: String, required: [true, 'Destination is required'], trim: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    cargoWeightKg: { type: Number, required: [true, 'Cargo weight is required'], min: 0 },
    plannedDistanceKm: { type: Number, required: [true, 'Planned distance is required'], min: 0 },
    actualDistanceKm: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(TRIP_STATUS), default: TRIP_STATUS.DRAFT },
    scheduledStart: { type: Date, default: Date.now },
    dispatchedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String, trim: true },
    fuelConsumedLtr: { type: Number, default: 0 },
    endOdometer: { type: Number },
    revenue: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

tripSchema.pre('save', async function (next) {
  if (!this.tripCode) {
    const count = await mongoose.model('Trip').countDocuments();
    this.tripCode = `TRP-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
