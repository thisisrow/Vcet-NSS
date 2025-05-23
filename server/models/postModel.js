const mongoose = require("mongoose");

//schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please add post title"],
    },
    description: {
      type: String,
      required: [true, "please add post description"],
    },
    document: {
      type: String,
      default: "",
    },
    documentType: {
      type: String,
      default: "",
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
