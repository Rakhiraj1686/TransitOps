const mongoose = require('mongoose');
const { VEHICLE_STATUS } = require('../constants/roles');

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: { type: String, required: [true, 'Vehicle name is required'], trim: true },
    type: {
      type: String,
      required: true,
      enum: ['Truck', 'Van', 'Mini Truck', 'Trailer', 'Bus', 'Pickup', 'Container Truck'],
    },
    maxCapacityKg: { type: Number, required: [true, 'Maximum capacity is required'], min: 1 },
    odometer: { type: Number, default: 0, min: 0 },
    purchaseCost: { type: Number, required: [true, 'Purchase cost is required'], min: 0 },
    status: { type: String, enum: Object.values(VEHICLE_STATUS), default: VEHICLE_STATUS.AVAILABLE },
    region: { type: String, default: 'Unassigned', trim: true },
    manufacturer: { type: String, trim: true },
    year: { type: Number },
    fuelType: { type: String, enum: ['Diesel', 'Petrol', 'CNG', 'Electric'], default: 'Diesel' },
    documents: [
      {
        title: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    imageUrl: { type: String, default: '' },
    notes: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

vehicleSchema.index({ registrationNumber: 'text', name: 'text' });

module.exports = mongoose.model('Vehicle', vehicleSchema);
