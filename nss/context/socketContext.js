import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { AuthContext } from './authContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auth] = useContext(AuthContext);

  // Function to join a chat room
  const joinRoom = (roomId) => {
    if (!roomId) return;
    
    setActiveRoom(roomId);
    setMessages([]); // Clear messages when joining a new room
    // Fetch chat history when joining a room
    fetchChatHistory(roomId);
  };

  // Function to fetch chat history
  const fetchChatHistory = async (roomId) => {
    if (!roomId || !auth?.token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/api/v1/chat/history/${roomId}`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`
        }
      });
      
      if (response.data && response.data.success) {
        setMessages(response.data.messages || []);
      } else {
        console.error('Error in response format:', response.data);
        setError('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  // Function to send a message
  const sendMessage = async (message) => {
    if (!activeRoom || !message.trim() || !auth?.user?._id || !auth?.token) {
      console.error('Missing required data for sending message');
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [userId1, userId2] = activeRoom.split('-');
      const receiverId = userId1 === auth.user._id.toString() ? userId2 : userId1;
      
      console.log('Sending message to API:', {
        room: activeRoom,
        sender: auth.user._id,
        receiver: receiverId,
        message
      });
      
      const response = await axios.post(
        `${API_URL}/api/v1/chat/send`,
        {
          message,
          room: activeRoom,
          sender: auth.user._id,
          receiver: receiverId
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`
          }
        }
      );

      console.log('Message send response:', response.data);
      
      if (response.data) {
        setMessages(prev => [...prev, response.data]);
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      setLoading(false);
      return false;
    }
  };

  // Function to mark messages as read
  const markMessagesAsRead = async () => {
    if (!activeRoom || !auth?.user?._id || !auth?.token) {
      console.log('Cannot mark messages as read: missing room or auth data');
      return false;
    }

    try {
      console.log(`Marking messages as read for room ${activeRoom}`);
      
      // Add catch for marking as read
      const response = await axios.put(
        `${API_URL}/api/v1/chat/read/${activeRoom}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`
          },
          timeout: 10000 // 10 second timeout
        }
      ).catch(error => {
        console.error('Error response from mark as read:', error.response?.data || error.message);
        // We'll still return as if it succeeded since this isn't critical
        return { data: { success: true, message: "Error handled gracefully" } };
      });
      
      console.log('Mark as read response:', response?.data);
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      // Don't display this error to the user as it's not critical
      return false;
    }
  };

  // Function to handle typing status
  const handleTyping = (isTyping) => {
    setIsTyping(isTyping);
  };

  // Function to get user chats
  const getUserChats = async () => {
    if (!auth?.token) return [];
    
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/chat/user-chats`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`
        }
      });
      
      if (data && data.success) {
        return data.chats || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching user chats:', error);
      return [];
    }
  };

  return (
    <SocketContext.Provider
      value={{
        messages,
        activeRoom,
        isTyping,
        loading,
        error,
        joinRoom,
        sendMessage,
        markMessagesAsRead,
        handleTyping,
        getUserChats
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}; 