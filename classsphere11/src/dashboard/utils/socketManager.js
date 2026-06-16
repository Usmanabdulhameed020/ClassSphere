import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;
  
  socket = io(SOCKET_SERVER_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
    try {
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      if (parsedUser && parsedUser.id) {
        socket.emit('registerUser', parsedUser.id);
      } else if (parsedUser && parsedUser._id) {
        socket.emit('registerUser', parsedUser._id);
      }
    } catch (e) {
      console.error('Failed to register user socket on connect:', e);
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const joinClassRoom = (classId, user) => {
  const sock = getSocket();
  sock.emit('joinClassRoom', classId, user);
};

export const leaveClassRoom = (classId, userId) => {
  const sock = getSocket();
  sock.emit('leaveClassRoom', classId, userId);
};

export const onUserJoined = (callback) => {
  const sock = getSocket();
  sock.on('userJoined', callback);
};

export const onUserLeft = (callback) => {
  const sock = getSocket();
  sock.on('userLeft', callback);
};

export const getClassUsers = (classId, callback) => {
  const sock = getSocket();
  sock.emit('getClassUsers', classId, callback);
};

export const getClassStats = (classId, callback) => {
  const sock = getSocket();
  sock.emit('getClassStats', classId, callback);
};

export const removeUserJoinedListener = () => {
  const sock = getSocket();
  sock.off('userJoined');
};

export const removeUserLeftListener = () => {
  const sock = getSocket();
  sock.off('userLeft');
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
