const Destination = require("../models/Destination");

// @route GET /api/destinations
// @desc  Get all destinations, with optional search by name/country
// @query ?search=bali  -> matches name or country
const getDestinations = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
        ],
      };
    }

    const destinations = await Destination.find(filter).sort({ name: 1 });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/destinations/:id
// @desc  Get a single destination by id
const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/destinations
// @desc  Create a new destination (used for seeding / admin)
const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json(destination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDestinations, getDestinationById, createDestination };
