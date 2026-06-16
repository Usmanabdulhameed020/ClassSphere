import axios from 'axios';
import { getSocket } from '../utils/socketManager';

const API_URL = '/api/messages';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const messageService = {
  getConversations: async () => {
    const response = await axios.get(`${API_URL}/conversations`, getAuthHeader());
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await axios.get(`${API_URL}/${conversationId}`, getAuthHeader());
    return response.data;
  },

  sendMessage: async (recipientId, content) => {
    const response = await axios.post(API_URL, { recipientId, content }, getAuthHeader());
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await axios.get(`${API_URL}/users/search?q=${query}`, getAuthHeader());
    return response.data;
  },

  // Socket Listeners
  onNewPrivateMessage: (callback) => {
    const socket = getSocket();
    if (socket) socket.on('receivePrivateMessage', callback);
  },

  removePrivateMessageListener: () => {
    const socket = getSocket();
    if (socket) socket.off('receivePrivateMessage');
  },

  onPrivateMessagesRead: (callback) => {
    const socket = getSocket();
    if (socket) socket.on('privateMessagesRead', callback);
  },

  removePrivateMessagesReadListener: () => {
    const socket = getSocket();
    if (socket) socket.off('privateMessagesRead');
  },

  onUserStatusUpdate: (callback) => {
    const socket = getSocket();
    if (socket) socket.on('userStatusUpdate', callback);
  },

  removeStatusListener: () => {
    const socket = getSocket();
    if (socket) socket.off('userStatusUpdate');
  }
};
