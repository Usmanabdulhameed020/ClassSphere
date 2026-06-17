import axios from 'axios';
import API_BASE_URL from '../../config';

const API_URL = `${API_BASE_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const dashboardService = {
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/auth/me`, getAuthHeader());
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axios.patch(`${API_URL}/auth/profile`, profileData, getAuthHeader());
    return response.data;
  },
  
  getClasses: async () => {
    const response = await axios.get(`${API_URL}/classes`, getAuthHeader());
    return Array.isArray(response.data) ? response.data : [];
  },

  createClass: async (classData) => {
    const response = await axios.post(`${API_URL}/classes`, classData, getAuthHeader());
    return response.data;
  },

  joinClass: async (code) => {
    const response = await axios.post(`${API_URL}/classes/join`, { code }, getAuthHeader());
    return response.data;
  },

  // Classroom Methods
  getAnnouncements: async (classId) => {
    const response = await axios.get(`${API_URL}/classroom/${classId}/announcements`, getAuthHeader());
    return response.data;
  },

  postAnnouncement: async (classId, content, attachments = []) => {
    const response = await axios.post(`${API_URL}/classroom/${classId}/announcements`, { content, attachments }, getAuthHeader());
    return response.data;
  },

  postComment: async (classId, announcementId, content) => {
    const response = await axios.post(`${API_URL}/classroom/${classId}/announcements/${announcementId}/comments`, { content }, getAuthHeader());
    return response.data;
  },

  getAssignments: async (classId) => {
    const response = await axios.get(`${API_URL}/classroom/${classId}/assignments`, getAuthHeader());
    return response.data;
  },

  postAssignment: async (classId, data) => {
    const response = await axios.post(`${API_URL}/classroom/${classId}/assignments`, data, getAuthHeader());
    return response.data;
  },

  getMaterials: async (classId) => {
    const response = await axios.get(`${API_URL}/classroom/${classId}/materials`, getAuthHeader());
    return response.data;
  },

  postMaterial: async (classId, data) => {
    const response = await axios.post(`${API_URL}/classroom/${classId}/materials`, data, getAuthHeader());
    return response.data;
  },

  getPeople: async (classId) => {
    const response = await axios.get(`${API_URL}/classroom/${classId}/people`, getAuthHeader());
    return response.data;
  },

  getMyAssignments: async () => {
    const response = await axios.get(`${API_URL}/classroom/my-assignments`, getAuthHeader());
    return response.data;
  },

  getMyMaterials: async () => {
    const response = await axios.get(`${API_URL}/classroom/my-materials`, getAuthHeader());
    return response.data;
  },

  // Attendance Methods
  getAttendance: async (classId, date = '') => {
    const url = date ? `${API_URL}/attendance/${classId}?date=${date}` : `${API_URL}/attendance/${classId}`;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  },

  markAttendance: async (classId, date, records) => {
    const response = await axios.post(`${API_URL}/attendance/${classId}`, { date, records }, getAuthHeader());
    return response.data;
  },

  getStudentAttendance: async (classId, studentId) => {
    const response = await axios.get(`${API_URL}/attendance/${classId}/student/${studentId}`, getAuthHeader());
    return response.data;
  },

  // Grading Methods
  getSubmissions: async (classId) => {
    const response = await axios.get(`${API_URL}/classroom/${classId}/submissions`, getAuthHeader());
    return response.data;
  },

  gradeSubmission: async (submissionId, grade, feedback) => {
    const response = await axios.patch(`${API_URL}/classroom/submissions/${submissionId}/grade`, { grade, feedback }, getAuthHeader());
    return response.data;
  },

  submitAssignment: async (classId, assignmentId, submissionData) => {
    const response = await axios.post(`${API_URL}/classroom/${classId}/assignments/${assignmentId}/submit`, submissionData, getAuthHeader());
    return response.data;
  },

  // Quiz Methods
  getQuizzes: async (classId) => {
    const response = await axios.get(`${API_URL}/quizzes/${classId}`, getAuthHeader());
    return response.data;
  },

  createQuiz: async (classId, quizData) => {
    const response = await axios.post(`${API_URL}/quizzes/${classId}`, quizData, getAuthHeader());
    return response.data;
  },

  getQuiz: async (quizId) => {
    const response = await axios.get(`${API_URL}/quizzes/quiz/${quizId}`, getAuthHeader());
    return response.data;
  },

  submitQuiz: async (quizId, answers) => {
    const response = await axios.post(`${API_URL}/quizzes/quiz/${quizId}/submit`, { answers }, getAuthHeader());
    return response.data;
  },

  getQuizSubmissions: async (quizId) => {
    const response = await axios.get(`${API_URL}/quizzes/quiz/${quizId}/submissions`, getAuthHeader());
    return response.data;
  },

  getQuizSubmissionsForClass: async (classId) => {
    const response = await axios.get(`${API_URL}/quizzes/class/${classId}/submissions`, getAuthHeader());
    return response.data;
  },

  gradeQuizSubmission: async (submissionId, score, feedback) => {
    const response = await axios.patch(`${API_URL}/quizzes/submissions/${submissionId}/grade`, { score, feedback }, getAuthHeader());
    return response.data;
  },

  // AI Methods
  aiGenerate: async (type, topic, context = '') => {
    const response = await axios.post(`${API_URL}/ai/generate`, { type, topic, context }, getAuthHeader());
    return response.data;
  },

  aiChat: async (message, classId = '') => {
    const response = await axios.post(`${API_URL}/ai/assistant`, { message, classId }, getAuthHeader());
    return response.data;
  },

  // Stats Methods
  getStats: async () => {
    const response = await axios.get(`${API_URL}/stats/summary`, getAuthHeader());
    const data = response.data;
    // Map backend names to frontend expected names
    return {
      activeSpheres: data.totalClasses || 0,
      citizens: data.totalUsers || 0,
      insights: data.totalAssignments || data.upcomingTasks || 0,
      ...data
    };
  },

  getSummaryStats: async () => {
    return dashboardService.getStats();
  },

  getEngagementStats: async () => {
    const response = await axios.get(`${API_URL}/stats/engagement`, getAuthHeader());
    return response.data;
  }
};
