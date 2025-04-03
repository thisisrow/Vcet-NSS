const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const {
  markAttendanceController,
} = require("../controllers/attendanceController");
const router = express.Router();

// Route to mark attendance for an event (admin-only route)
router.put("/markattendance", markAttendanceController);

module.exports = router;
