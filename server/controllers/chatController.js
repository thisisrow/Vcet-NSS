const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// Get chat history between two users
const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Chat.find({ roomId })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");
    
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching chat history",
      error: error.message,
    });
  }
};

// Get all chats for a user
const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all unique rooms where the user is either sender or receiver
    const chats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    // Group chats by roomId
    const groupedChats = chats.reduce((acc, chat) => {
      if (!acc[chat.roomId]) {
        const otherUser = chat.sender._id.toString() === userId.toString() 
          ? chat.receiver 
          : chat.sender;
          
        acc[chat.roomId] = {
          roomId: chat.roomId,
          lastMessage: chat.message,
          timestamp: chat.updatedAt,
          unread: chat.receiver._id.toString() === userId.toString() && !chat.read,
          otherUser: otherUser,
        };
      }
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      chats: Object.values(groupedChats),
    });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user chats",
      error: error.message,
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Ensure roomId is provided
    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }
    
    // Get user from auth middleware
    const userId = req.user._id;
    
    console.log(`Marking messages as read for room: ${roomId}, user: ${userId}`);

    try {
      // Update all unread messages
      const result = await Chat.updateMany(
        {
          roomId: roomId,
          receiver: userId,
          read: false,
        },
        { $set: { read: true } }
      );
      
      console.log("Update result:", result);
      
      // Notify via socket if available
      if (req.app.get('io')) {
        req.app.get('io').to(roomId).emit('messages_read', {
          roomId,
          userId: userId.toString()
        });
      }

      res.status(200).json({
        success: true,
        message: `Marked ${result.modifiedCount} messages as read`,
      });
    } catch (updateError) {
      console.error("Error in updateMany:", updateError);
      throw updateError;
    }
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking messages as read",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { message, room, sender, receiver } = req.body;

    // Validate required fields
    if (!message || !room || !sender || !receiver) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create new message
    const newMessage = await Chat.create({
      sender,
      receiver,
      message,
      roomId: room,
    });

    // Populate sender and receiver names
    const populatedMessage = await Chat.findById(newMessage._id)
      .populate("sender", "name")
      .populate("receiver", "name");

    // Emit to socket if needed
    if (req.app.get('io')) {
      req.app.get('io').to(room).emit('receive_message', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

module.exports = {
  getChatHistory,
  getUserChats,
  markAsRead,
  sendMessage,
}; 