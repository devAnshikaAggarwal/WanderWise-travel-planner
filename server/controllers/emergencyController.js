const Emergency = require('../models/Emergency');

// @route GET /api/emergency
// @desc  Get all emergency contacts, or search by country
// @query ?country=india
const getEmergencyContacts = async (req, res) => {
  try {
    const { country } = req.query;

    let filter = {};
    if (country) {
      filter = { country: { $regex: country, $options: 'i' } };
    }

    const contacts = await Emergency.find(filter).sort({ country: 1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/emergency/:id
// @desc  Get emergency contacts for one specific country
const getEmergencyById = async (req, res) => {
  try {
    const contact = await Emergency.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Emergency contacts not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/emergency
// @desc  Add emergency contacts for a country (admin/seed use)
const createEmergencyContact = async (req, res) => {
  try {
    const contact = await Emergency.create(req.body);
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEmergencyContacts, getEmergencyById, createEmergencyContact };