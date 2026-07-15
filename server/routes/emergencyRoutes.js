const express = require("express");
const router = express.Router();
const {
  getEmergencyContacts,
  getEmergencyById,
  createEmergencyContact,
} = require("../controllers/emergencyController");

router.get("/", getEmergencyContacts);
router.get("/:id", getEmergencyById);
router.post("/", createEmergencyContact);

module.exports = router;
