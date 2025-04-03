const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getChatHistory,
  getUserChats,
  markAsRead,
  sendMessage,
} = require("../controllers/chatController");
const Chat = require("../models/chatModel");

const router = express.Router();

router.get("/history/:roomId", protect, getChatHistory);
router.get("/user-chats", protect, getUserChats);
router.put("/read/:roomId", protect, markAsRead);
router.post("/send", protect, sendMessage);

module.exports = router; 