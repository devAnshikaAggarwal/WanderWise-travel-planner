const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  country: { type: String, required: true, unique: true },
  policeNo: { type: String },
  ambulanceNo: { type: String },
  fireNo: { type: String },
  touristHelpline: { type: String },
});

module.exports = mongoose.model('Emergency', emergencySchema);
