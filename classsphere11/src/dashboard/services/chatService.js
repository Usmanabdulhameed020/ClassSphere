import axios from 'axios';
import { getSocket } from '../utils/socketManager';

const API_URL = 'http://localhost:5000/api/chat';

export const chatService = {
  // Get chat history from server
  getChatHistory: async (classId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/${classId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Send message via socket
  sendMessage: (classId, user, content, type = 'text', attachments = []) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('sendMessage', {
      classId,
      senderId: user.id || user._id,
      senderName: user.username,
      senderRole: user.role,
      senderProfilePicture: user.profilePicture,
      content,
      type,
      attachments
    });
  },

  // Typing indicators
  sendTypingStatus: (classId, username, isTyping) => {
    const socket = getSocket();
    if (socket) socket.emit('typing', { classId, username, isTyping });
  },

  onUserTyping: (callback) => {
    const socket = getSocket();
    if (socket) socket.on('userTyping', callback);
  },

  removeTypingListener: () => {
    const socket = getSocket();
    if (socket) socket.off('userTyping');
  },

  // Listen for incoming messages
  onReceiveMessage: (callback) => {
    const socket = getSocket();
    if (!socket) return;
    socket.on('receiveMessage', callback);
  },

  // Stop listening for messages
  removeReceiveMessageListener: () => {
    const socket = getSocket();
    if (socket) socket.off('receiveMessage');
  }
};
