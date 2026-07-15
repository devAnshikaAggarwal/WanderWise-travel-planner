const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    bestTime: { type: String },
    climate: { type: String },
    photos: [{ type: String }],
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Destination", destinationSchema);
