const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  item: { type: String, required: true },
  checked: { type: Boolean, default: false },
  category: { type: String, default: 'general' },
});

module.exports = mongoose.model('Checklist', checklistSchema);
