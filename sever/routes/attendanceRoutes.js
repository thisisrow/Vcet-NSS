const express = require('express');
const { requireSingIn } = require("../controllers/userController");
const User = require('../models/userModel');
const Event = require('../models/eventModel');
const { markAttendanceController } = require("../controllers/attendanceController");
const router = express.Router();

// Route to mark attendance for an event (admin-only route)
router.patch('/markattendance', requireSingIn, markAttendanceController);

module.exports = router;
