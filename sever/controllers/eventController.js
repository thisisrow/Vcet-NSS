const Event = require("../models/eventModel");

// Controller for creating an event
const createEventController = async (req, res) => {
  try {
    const { eventName, description, date, duration } = req.body;

    const newEvent = new Event({
      eventName,
      description,
      date,
      duration,
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
};

// Controller for fetching all events
const getAllEventsController = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

// Controller for fetching today's events

module.exports = {
  createEventController,
  getAllEventsController,
};
