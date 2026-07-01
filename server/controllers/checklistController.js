const Checklist = require('../models/Checklist');
const Trip = require('../models/Trip');

const verifyTripOwnership = async (tripId, userId) => {
  return await Trip.findOne({ _id: tripId, userId });
};

// @route POST /api/checklist/:tripId
// @desc  Add an item to the trip checklist
const addItem = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const { item, category } = req.body;
    if (!item) return res.status(400).json({ message: 'Item name is required' });

    const checklistItem = await Checklist.create({
      tripId: req.params.tripId,
      item,
      category: category || 'general',
    });

    res.status(201).json(checklistItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/checklist/:tripId
// @desc  Get all checklist items for a trip
const getChecklist = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const items = await Checklist.find({ tripId: req.params.tripId }).sort({ category: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/checklist/:tripId/:itemId
// @desc  Toggle checked/unchecked or update item
const updateItem = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const checklistItem = await Checklist.findOne({
      _id: req.params.itemId,
      tripId: req.params.tripId,
    });

    if (!checklistItem) return res.status(404).json({ message: 'Item not found' });

    // Toggle checked if not explicitly sent
    if (req.body.checked !== undefined) {
      checklistItem.checked = req.body.checked;
    } else {
      checklistItem.checked = !checklistItem.checked;
    }

    if (req.body.item) checklistItem.item = req.body.item;
    if (req.body.category) checklistItem.category = req.body.category;

    const updated = await checklistItem.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/checklist/:tripId/:itemId
// @desc  Delete a checklist item
const deleteItem = async (req, res) => {
  try {
    const trip = await verifyTripOwnership(req.params.tripId, req.user.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const item = await Checklist.findOneAndDelete({
      _id: req.params.itemId,
      tripId: req.params.tripId,
    });

    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addItem, getChecklist, updateItem, deleteItem };