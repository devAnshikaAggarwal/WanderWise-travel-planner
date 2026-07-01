const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, unique: true },
  totalBudget: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  spent: { type: Number, default: 0 },
});

module.exports = mongoose.model('Budget', budgetSchema);
