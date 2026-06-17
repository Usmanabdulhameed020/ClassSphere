import axios from 'axios';
import API_BASE_URL from '../../config';

const API_URL = `${API_BASE_URL}/api/admin`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const adminService = {
  getStats: async () => {
    const response = await axios.get(`${API_URL}/stats`, getAuthHeader());
    return response.data;
  },

  getUsers: async (role = 'all', search = '') => {
    const response = await axios.get(`${API_URL}/users?role=${role}&search=${search}`, getAuthHeader());
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axios.post(`${API_URL}/users`, userData, getAuthHeader());
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axios.patch(`${API_URL}/users/${id}`, userData, getAuthHeader());
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`, getAuthHeader());
    return response.data;
  },

  getClasses: async () => {
    const response = await axios.get(`${API_URL}/classes`, getAuthHeader());
    return response.data;
  },

  deleteClass: async (id) => {
    const response = await axios.delete(`${API_URL}/classes/${id}`, getAuthHeader());
    return response.data;
  },

  getDetailedStats: async () => {
    const response = await axios.get(`${API_URL}/detailed-stats`, getAuthHeader());
    return response.data;
  },

  broadcast: async (data) => {
    const response = await axios.post(`${API_URL}/broadcast`, data, getAuthHeader());
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await axios.get(`${API_URL}/audit-logs`, getAuthHeader());
    return response.data;
  }
};
