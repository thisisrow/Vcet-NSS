const User = require("../models/userModel"); // Import the User model
const Event = require("../models/eventModel"); // Import the Event model

const markAttendanceController = async (req, res) => {
  const { selectedVolunteers, eventName, eventHours } = req.body;

  try {
    const event = await Event.findOne({ eventName });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check for already marked volunteers
    const alreadyMarkedVolunteers = [];
    const newVolunteers = [];

    for (const volunteerId of selectedVolunteers) {
      const volunteer = await User.findById(volunteerId);
      if (volunteer) {
        // Check if volunteer has already attended this event
        if (volunteer.eventsAttended.includes(event.eventName)) {
          alreadyMarkedVolunteers.push(volunteer.name);
        } else {
          newVolunteers.push(volunteerId);
          volunteer.attendance += 1;
          volunteer.hours += event.duration;
          volunteer.eventsAttended.push(event.eventName);
          await volunteer.save();
        }
      }
    }

    // Add only new volunteers to event's attendance
    if (newVolunteers.length > 0) {
      event.volunteersPresent.push(...newVolunteers);
      await event.save();
    }

    // Prepare response message
    let message = "";
    if (newVolunteers.length > 0) {
      message = "Attendance marked successfully.";
      if (alreadyMarkedVolunteers.length > 0) {
        message += ` However, the following volunteers were skipped as they already attended this event: ${alreadyMarkedVolunteers.join(", ")}`;
      }
    } else {
      message = "All selected volunteers have already attended this event.";
    }

    res.status(200).json({ 
      message,
      success: newVolunteers.length > 0,
      alreadyMarkedVolunteers,
      markedVolunteers: newVolunteers
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { markAttendanceController };
