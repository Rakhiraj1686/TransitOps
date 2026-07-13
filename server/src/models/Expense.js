const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    category: { type: String, enum: ['Toll', 'Fine', 'Insurance', 'Permit', 'Cleaning', 'Other'], default: 'Other' },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
