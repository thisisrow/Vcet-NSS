const express = require("express");
const {
  markAttendanceController,
} = require("../controllers/attendanceController");
const router = express.Router();

// Route to mark attendance for an event (admin-only route)
router.post("/mark-attendance", markAttendanceController);

module.exports = router;
