const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const User = require("./models/userModel"); // Import the User model
const Event = require("./models/eventModel"); // Import the Event model

//DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Increase timeout for large file uploads
app.timeout = 120000; // 2 minutes

//ROUTES
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/post", require("./routes/postRoutes"));
app.use("/api/v1/events", require("./routes/eventRoutes"));
app.use("/api/v1/present", require("./routes/attendanceRoutes"));

//PORT
const PORT = process.env.PORT || 3000;

//listen
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.bgGreen.white);
});
