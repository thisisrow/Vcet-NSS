const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Please add event name"],
    },
    description: {
      type: String,
      required: [true, "Please add event description"],
    },
    date: {
      type: Date,
      required: [true, "Please add event date"],
    },
    duration: {
      type: Number,
      required: [true, "Please add event duration in hours"],
    },
    volunteersPresent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
