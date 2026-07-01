const Trip = require('../models/Trip');

// @route POST /api/trips
// @desc  Create a new trip for the logged-in user
const createTrip = async (req, res) => {
  try {
    const { title, destinationId, startDate, endDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Trip title is required' });
    }

    const trip = await Trip.create({
      userId: req.user.id,
      destinationId,
      title,
      startDate,
      endDate,
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/trips
// @desc  Get all trips belonging to the logged-in user
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id })
      .populate('destinationId', 'name country image')
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/trips/:id
// @desc  Get a single trip by id (only if it belongs to the logged-in user)
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('destinationId');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/trips/:id
// @desc  Update a trip (only if it belongs to the logged-in user)
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const { title, destinationId, startDate, endDate, status } = req.body;

    if (title !== undefined) trip.title = title;
    if (destinationId !== undefined) trip.destinationId = destinationId;
    if (startDate !== undefined) trip.startDate = startDate;
    if (endDate !== undefined) trip.endDate = endDate;
    if (status !== undefined) trip.status = status;

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/trips/:id
// @desc  Delete a trip (only if it belongs to the logged-in user)
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTrip, getTrips, getTripById, updateTrip, deleteTrip };