const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  dayNumber: { type: Number, required: true },
  activity: { type: String, required: true },
  note: { type: String },
  time: { type: String },
});

module.exports = mongoose.model("Itinerary", itinerarySchema);
