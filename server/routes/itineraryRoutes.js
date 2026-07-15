const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addActivity,
  getItinerary,
  updateActivity,
  deleteActivity,
} = require("../controllers/itineraryController");

router.post("/:tripId", protect, addActivity);
router.get("/:tripId", protect, getItinerary);
router.put("/:tripId/:activityId", protect, updateActivity);
router.delete("/:tripId/:activityId", protect, deleteActivity);

module.exports = router;
