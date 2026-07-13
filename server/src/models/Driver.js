const mongoose = require('mongoose');
const { DRIVER_STATUS } = require('../constants/roles');

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Driver name is required'], trim: true },
    licenseNumber: { type: String, required: [true, 'License number is required'], unique: true, trim: true },
    licenseCategory: {
      type: String,
      required: true,
      enum: ['LMV', 'HMV', 'HGMV', 'HPMV', 'Trailer', 'Motorcycle'],
    },
    licenseExpiry: { type: Date, required: [true, 'License expiry date is required'] },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    email: { type: String, trim: true, lowercase: true },
    safetyScore: { type: Number, default: 100, min: 0, max: 100 },
    status: { type: String, enum: Object.values(DRIVER_STATUS), default: DRIVER_STATUS.AVAILABLE },
    address: { type: String, trim: true },
    joiningDate: { type: Date, default: Date.now },
    photoUrl: { type: String, default: '' },
    linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

driverSchema.virtual('isLicenseExpired').get(function () {
  return this.licenseExpiry < new Date();
});

driverSchema.set('toJSON', { virtuals: true });
driverSchema.set('toObject', { virtuals: true });
driverSchema.index({ name: 'text', licenseNumber: 'text' });

module.exports = mongoose.model('Driver', driverSchema);
