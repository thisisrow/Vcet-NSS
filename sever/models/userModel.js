const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please add email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "please add password"],
      minlength: 6,
      maxlength: 64,
    },
    role: {
      type: String,
      default: "Volunteer",
    },
    position: {
      type: String,
      default: "Volunteer",
    },
    year: {
      type: String,
      required: [true, "please add year"],
    },
    team: {
      type: String,
      required: [true, "please add team"],
    },
    attendance: {
      type: Number,
      default: 0,
    },
    hours: {
      type: Number,
      default: 0,
    },
    eventsAttended: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
