const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addItem,
  getChecklist,
  updateItem,
  deleteItem,
} = require("../controllers/checklistController");

router.post("/:tripId", protect, addItem);
router.get("/:tripId", protect, getChecklist);
router.put("/:tripId/:itemId", protect, updateItem);
router.delete("/:tripId/:itemId", protect, deleteItem);

module.exports = router;
