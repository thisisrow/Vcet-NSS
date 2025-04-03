const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const http = require("http");
const socketIo = require("socket.io");
const Chat = require("./models/chatModel");

const User = require("./models/userModel"); // Import the User model
const Event = require("./models/eventModel"); // Import the Event model

//DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make io available to routes
app.set('io', io);

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Increase timeout for large file uploads
app.timeout = 120000; // 2 minutes

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);
  
  // Join a room (for chat)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Handle chat messages
  socket.on("send_message", async (data) => {
    try {
      // Save message to database
      const newMessage = await Chat.create({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        roomId: data.room,
      });

      // Populate sender and receiver names
      const populatedMessage = await Chat.findById(newMessage._id)
        .populate("sender", "name")
        .populate("receiver", "name");

      // Emit message to room
      io.to(data.room).emit("receive_message", populatedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle typing status
  socket.on("typing", (data) => {
    socket.to(data.room).emit("user_typing", {
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  // Handle read status
  socket.on("mark_read", async (data) => {
    try {
      await Chat.updateMany(
        {
          roomId: data.room,
          receiver: data.userId,
          read: false,
        },
        { read: true }
      );
      
      socket.to(data.room).emit("messages_read", {
        roomId: data.room,
        userId: data.userId
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

//ROUTES
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/post", require("./routes/postRoutes"));
app.use("/api/v1/events", require("./routes/eventRoutes"));
app.use("/api/v1/present", require("./routes/attendanceRoutes"));
app.use("/api/v1/chat", require("./routes/chatRoutes"));

//PORT
const PORT = process.env.PORT || 3000;

//listen
server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.bgGreen.white);
});
