const Itinerary = require('../models/Itinerary');
const Trip = require('../models/Trip');

const verifyTripOwnership = async (tripId, userId) => {
  return await Trip.findOne({ _id: tripId, userId });
};

// @route POST /api/itinerary/:tripId
// @desc  Add an activity to a specific day of a trip
const addActivity = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const { dayNumber, activity, note, time } = req.body;
    if (!dayNumber || !activity) {
      return res.status(400).json({ message: 'dayNumber and activity are required' });
    }

    const item = await Itinerary.create({
      tripId: req.params.tripId,
      dayNumber,
      activity,
      note,
      time,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/itinerary/:tripId
// @desc  Get all activities for a trip, grouped by day
const getItinerary = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const items = await Itinerary.find({ tripId: req.params.tripId }).sort({ dayNumber: 1, time: 1 });

    // Group activities by day number
    const grouped = items.reduce((acc, item) => {
      const day = `Day ${item.dayNumber}`;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/itinerary/:tripId/:activityId
// @desc  Update an activity
const updateActivity = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const item = await Itinerary.findOneAndUpdate(
      { _id: req.params.activityId, tripId: req.params.tripId },
      { $set: req.body },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Activity not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/itinerary/:tripId/:activityId
// @desc  Delete an activity
const deleteActivity = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const item = await Itinerary.findOneAndDelete({
      _id: req.params.activityId,
      tripId: req.params.tripId,
    });

    if (!item) return res.status(404).json({ message: 'Activity not found' });
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addActivity, getItinerary, updateActivity, deleteActivity };