const express = require('express');
const { requireSingIn } = require("../controllers/userController");
const User = require('../models/userModel');
const Event = require('../models/eventModel');

const router = express.Router();

// PUT: Mark attendance for volunteers
router.put('/mark-attendance', async (req, res) => {
  // Log the request body to check if the API is hit
  console.log('Mark Attendance API Hit:', req.body);

  const { selectedVolunteers, eventName, eventHours } = req.body;

  try {
    // Update each volunteer's attendance and hours
    await Promise.all(
      selectedVolunteers.map(async (volunteerId) => {
        // Update user's attendance and hours
        await User.findByIdAndUpdate(volunteerId, {
          $inc: {
            attendance: 1, // Increment attendance count
            hours: eventHours // Add event hours
          },
          $addToSet: {
            eventsAttended: eventName // Add event name to the list
          }
        });
      })
    );

    // Update the event's volunteersPresent
    await Event.findOneAndUpdate(
      { eventName }, // Assuming eventName is unique; adjust as necessary
      { $addToSet: { volunteersPresent: { $each: selectedVolunteers } } }
    );

    return res.status(200).json({ message: 'Attendance marked successfully!' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ message: 'Failed to mark attendance.', error });
  }
});

module.exports = router;
