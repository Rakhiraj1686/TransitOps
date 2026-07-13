const mongoose = require('mongoose');
const { MAINTENANCE_STATUS } = require('../constants/roles');

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    issue: { type: String, required: [true, 'Issue description is required'], trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    technician: { type: String, required: [true, 'Technician name is required'], trim: true },
    status: { type: String, enum: Object.values(MAINTENANCE_STATUS), default: MAINTENANCE_STATUS.PENDING },
    cost: { type: Number, default: 0, min: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
