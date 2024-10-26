const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const {
  createEventController,
  getAllEventsController,
} = require("../controllers/eventController");
const router = express.Router();

// Route to create an event (admin-only route)
router.post("/create", requireSingIn,createEventController);

// Route to get all events (available to admin and volunteers)
router.get("/all",getAllEventsController);



module.exports = router;