const User = require("../models/userModel");
const Event = require("../models/eventModel");

// Controller for marking attendance for an event
const markAttendanceController = async (req, res) => {
  try {
    const { eventId, volunteers, duration } = req.body;

    // Update attendance for each volunteer
    for (let volunteerId of volunteers) {
      await User.findByIdAndUpdate(volunteerId, {
        $inc: { attendance: 1, hours: duration },
        $push: { eventsAttended: eventId },
      });
    }

    // Update event with volunteers who attended
    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { volunteersPresent: { $each: volunteers } },
    });

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking attendance",
      error: error.message,
    });
  }
};

module.exports = {
  markAttendanceController,
};
