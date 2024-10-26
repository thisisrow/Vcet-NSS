const User = require('../models/userModel'); // Import the User model
const Event = require('../models/eventModel'); // Import the Event model

const markAttendanceController = async (req, res) => {
 const { eventId, selectedVolunteers } = req.body;

 try {
   const event = await Event.findById(eventId);
   if (!event) {
     return res.status(404).json({ message: "Event not found" });
   }

   for (const volunteerId of selectedVolunteers) {
     const volunteer = await User.findById(volunteerId);
     if (volunteer) {
       volunteer.attendance += 1;
       volunteer.hours += event.duration;
       volunteer.eventsAttended.push(event.eventName);
       await volunteer.save();
     }
   }

   event.volunteersPresent.push(...selectedVolunteers);
   await event.save();

   res.status(200).json({ message: "Attendance marked successfully." });
 } catch (error) {
   console.error("Error marking attendance:", error);
   res.status(500).json({ error: "Internal Server Error" });
 }
};

module.exports = { markAttendanceController };
