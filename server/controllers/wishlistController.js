const Wishlist = require('../models/Wishlist');

const addToWishlist = async (req, res) => {
  try {
    const { destinationId } = req.body;

    if (!destinationId) {
      return res.status(400).json({ message: 'destinationId is required' });
    }

    const existing = await Wishlist.findOne({ userId: req.user.id, destinationId });
    if (existing) {
      return res.status(400).json({ message: 'Destination already in wishlist' });
    }

    const item = await Wishlist.create({ userId: req.user.id, destinationId });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id })
      .populate('destinationId')
      .sort({ savedAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      userId: req.user.id,
      destinationId: req.params.destinationId,
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };