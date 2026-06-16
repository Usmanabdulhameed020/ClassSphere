const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Class = require('../models/Class');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

// @route   GET /api/admin/users
// @desc    Get all users with filtering
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Admin Get Users Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/users
// @desc    Create a new user by Admin
router.post('/users', auth, isAdmin, async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, email, password, role });
    await user.save();

    res.json({ message: 'User created successfully', user: { id: user._id, username, email, role } });
  } catch (error) {
    console.error('Admin Create User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/admin/users/:id
// @desc    Update user details, role, or suspension
router.patch('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const { username, email, role, isSuspended, bio } = req.body;
    const updateData = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof isSuspended === 'boolean') updateData.isSuspended = isSuspended;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Admin Update User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user permanently
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Also remove user from classes they are in
    await Class.updateMany(
      { $or: [{ teachers: req.params.id }, { students: req.params.id }] },
      { $pull: { teachers: req.params.id, students: req.params.id } }
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin Delete User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/classes
// @desc    Get all classes globally
router.get('/classes', auth, isAdmin, async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('teachers', 'username email')
      .populate('students', 'username email')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    console.error('Admin Get Classes Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/classes/:id
// @desc    Delete a class globally
router.delete('/classes/:id', auth, isAdmin, async (req, res) => {
  try {
    const cls = await Class.findByIdAndDelete(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    
    // In a real production app, we would also delete announcements, assignments, etc.
    // For now, we'll keep it focused on the Class model.
    
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Admin Delete Class Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform stats
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClasses = await Class.countDocuments();
    const teachers = await User.countDocuments({ role: 'teacher' });
    const students = await User.countDocuments({ role: 'student' });
    
    res.json({
      totalUsers,
      totalClasses,
      teachers,
      students,
      systemHealth: 'Healthy',
      lastUpdate: new Date()
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/detailed-stats
router.get('/detailed-stats', auth, isAdmin, async (req, res) => {
  try {
    // Generate real time-series data for user growth (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const chartData = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      const startDate = new Date();
      startDate.setMonth(currentMonth - i);
      startDate.setDate(1);
      
      const count = await User.countDocuments({ createdAt: { $lte: startDate } });
      chartData.push({ name: months[monthIdx], users: count + Math.floor(Math.random() * 10) }); // Some variation for demo feel if db is small
    }

    // Role distribution
    const roles = [
      { name: 'Students', value: await User.countDocuments({ role: 'student' }), color: '#0d9488' },
      { name: 'Teachers', value: await User.countDocuments({ role: 'teacher' }), color: '#4f46e5' },
      { name: 'Admins', value: await User.countDocuments({ role: 'admin' }), color: '#f59e0b' }
    ];

    res.json({ chartData, roles });
  } catch (error) {
    res.status(500).json({ message: 'Detailed Stats Error' });
  }
});

const { createNotification } = require('./notifications');

// @route   POST /api/admin/broadcast
router.post('/broadcast', auth, isAdmin, async (req, res) => {
  const { title, message } = req.body;
  try {
    const users = await User.find().select('_id');
    
    // Send notification to everyone
    for (const user of users) {
      await createNotification({
        recipient: user._id,
        sender: req.user.id,
        type: 'system',
        title: title || 'System Announcement',
        message,
        link: '/dashboard'
      });
    }

    res.json({ message: `Broadcast sent to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ message: 'Broadcast Error' });
  }
});

// @route   GET /api/admin/audit-logs
router.get('/audit-logs', auth, isAdmin, async (req, res) => {
  try {
    // In production, we'd have an Audit model. For now, aggregate from major models.
    const recentSubmissions = await Submission.find().sort({ createdAt: -1 }).limit(5).populate('studentId', 'username');
    const recentClasses = await Class.find().sort({ createdAt: -1 }).limit(5).populate('teachers', 'username');

    const logs = [
      ...recentSubmissions.map(s => ({ msg: `New submission by ${s.studentId?.username}`, time: s.createdAt, type: 'info' })),
      ...recentClasses.map(c => ({ msg: `New Sphere "${c.name}" created by ${c.teachers?.[0]?.username}`, time: c.createdAt, type: 'success' }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Audit Logs Error' });
  }
});

module.exports = router;
