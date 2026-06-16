import axios from 'axios';
import API_BASE_URL from '../../config';

const API_URL = `${API_BASE_URL}/api/notifications`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const notificationService = {
  getNotifications: async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/read`, {}, getAuthHeader());
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axios.patch(`${API_URL}/read-all`, {}, getAuthHeader());
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  }
};
