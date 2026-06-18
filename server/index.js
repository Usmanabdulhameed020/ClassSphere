const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from frontend build
const path = require('path');
app.use(express.static(path.join(__dirname, '../classsphere11/dist')));

// Import Routes
const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/classes');
const classroomRoutes = require('./routes/classroom');
const attendanceRoutes = require('./routes/attendance');
const quizRoutes = require('./routes/quizzes');
const aiRoutes = require('./routes/ai');
const { router: notificationRoutes } = require('./routes/notifications');
const statsRoutes = require('./routes/stats');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/classroom', classroomRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);

// Catch-all route to serve the React application for client-side routing
// This ensures direct URL access and page refreshes work correctly on deployed SPA
app.get('/{*path}', (req, res) => {
  // Don't catch API routes (they're already handled by route middleware above)
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../classsphere11/dist/index.html'));
});

// Real-time Socket.io Events
const classRooms = {}; // Track users in each class
const connectedUsers = new Map(); // Track online users
const whiteboardHistory = {}; // Track whiteboard strokes in each class

// Expose io and connectedUsers globally so routes can send real-time events
global.io = io;
global.connectedUsers = connectedUsers;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Register online user
  socket.on('registerUser', (userId) => {
    connectedUsers.set(userId, socket.id);
    io.emit('userStatusUpdate', { userId, status: 'online' });
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
  });

  // User joins a class room
  socket.on('joinClassRoom', (classId, user) => {
    socket.join(`class-${classId}`);
    
    if (!classRooms[classId]) {
      classRooms[classId] = [];
    }
    
    const userInClass = {
      id: user._id,
      username: user.username,
      role: user.role,
      socketId: socket.id,
      joinedAt: new Date()
    };
    
    classRooms[classId].push(userInClass);
    connectedUsers.set(user._id, socket.id);
    
    // Broadcast to all users in the class that someone joined
    io.to(`class-${classId}`).emit('userJoined', {
      user: userInClass,
      totalUsers: classRooms[classId].length,
      message: `${user.username} joined the class`
    });
    
    console.log(`${user.username} joined class ${classId}`);
  });

  // User leaves a class room
  socket.on('leaveClassRoom', (classId, userId) => {
    socket.leave(`class-${classId}`);
    
    if (classRooms[classId]) {
      classRooms[classId] = classRooms[classId].filter(u => u.id !== userId);
      
      io.to(`class-${classId}`).emit('userLeft', {
        userId,
        totalUsers: classRooms[classId].length,
        message: `A user left the class`
      });
    }
  });

  // Handle Real-time Chat
  socket.on('sendMessage', async (data) => {
    const { classId, senderId, senderName, senderRole, senderProfilePicture, content, type, attachments } = data;
    
    try {
      // Save message to database
      const newMessage = new Message({
        classId,
        sender: senderId,
        senderName,
        senderRole,
        senderProfilePicture,
        content,
        type: type || 'text',
        attachments: attachments || []
      });
      
      await newMessage.save();
      
      // Broadcast to all users in the class room
      io.to(`class-${classId}`).emit('receiveMessage', newMessage);
      
      console.log(`Chat message from ${senderName} in class ${classId}`);
    } catch (error) {
      console.error('Socket Chat Error:', error);
    }
  });

  socket.on('typing', (data) => {
    const { classId, username, isTyping } = data;
    socket.to(`class-${classId}`).emit('userTyping', { username, isTyping });
  });

  // Real-time Whiteboard sync events
  socket.on('draw-stroke', (data) => {
    const { classId, stroke } = data;
    if (!whiteboardHistory[classId]) {
      whiteboardHistory[classId] = [];
    }
    whiteboardHistory[classId].push(stroke);
    if (whiteboardHistory[classId].length > 2000) {
      whiteboardHistory[classId].shift(); // Keep history size bounded
    }
    socket.to(`class-${classId}`).emit('draw-stroke', stroke);
  });

  socket.on('clear-canvas', (data) => {
    const { classId } = data;
    whiteboardHistory[classId] = [];
    socket.to(`class-${classId}`).emit('clear-canvas');
  });

  socket.on('get-whiteboard-history', (classId, callback) => {
    if (typeof callback === 'function') {
      callback(whiteboardHistory[classId] || []);
    }
  });

  // Chat Read Receipts
  socket.on('read-class-messages', async (data) => {
    const { classId, userId, username } = data;
    try {
      await Message.updateMany(
        { classId, sender: { $ne: userId }, 'readBy.userId': { $ne: userId } },
        { $push: { readBy: { userId, username, readAt: new Date() } } }
      );
      io.to(`class-${classId}`).emit('userReadMessages', { classId, userId, username });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // Get current users in a class
  socket.on('getClassUsers', (classId, callback) => {
    if (classRooms[classId]) {
      const users = classRooms[classId];
      const stats = {
        total: users.length,
        admins: 0,
        teachers: users.filter(u => u.role?.toLowerCase() === 'teacher').length,
        students: users.filter(u => u.role?.toLowerCase() === 'student').length,
        users: users
      };
      callback(stats);
    } else {
      callback({
        total: 0,
        admins: 0,
        teachers: 0,
        students: 0,
        users: []
      });
    }
  });

  // Get class statistics by role
  socket.on('getClassStats', (classId, callback) => {
    if (classRooms[classId]) {
      const users = classRooms[classId];
      callback({
        admins: [],
        teachers: users.filter(u => u.role?.toLowerCase() === 'teacher'),
        students: users.filter(u => u.role?.toLowerCase() === 'student')
      });
    } else {
      callback({ admins: [], teachers: [], students: [] });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from connected users
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        io.emit('userStatusUpdate', { userId, status: 'offline' });
        break;
      }
    }

    // Clean up class rooms
    for (let classId in classRooms) {
      classRooms[classId] = classRooms[classId].filter(u => u.socketId !== socket.id);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

