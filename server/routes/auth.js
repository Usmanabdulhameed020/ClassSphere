const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendLoginNotification, sendResetCode } = require('../config/mail');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password, role, extraFields } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ 
      username, 
      email, 
      password, 
      role,
      institution: extraFields?.field1,
      department: role === 'teacher' ? extraFields?.field1 : undefined,
      employeeID: role === 'teacher' ? extraFields?.field2 : undefined,
      studentID: role === 'student' ? extraFields?.field2 : undefined
    });
    
    // Override institution if it's admin/student
    if (role === 'admin' || role === 'student') {
        user.institution = extraFields?.field1;
    }

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username, email, role: user.role } });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send reset code to email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpires = Date.now() + 600000; // 10 mins
    await user.save();

    await sendResetCode(user.email, user.username, code);
    res.json({ message: 'Reset code sent to your email' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using code
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ 
      email, 
      resetCode: code,
      resetCodeExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired code' });

    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/select-role
// @desc    Select user role after registration
router.post('/select-role', auth, async (req, res) => {
  const { role } = req.body;

  if (!['student', 'teacher', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      message: 'Role updated successfully', 
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Role Selection Error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.isSuspended) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact the administrator.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Trigger Email Notification
    await sendLoginNotification(user.email, user.username);

    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// @route   POST /api/auth/google
// @desc    Google login or signup
router.post('/google', async (req, res) => {
  const { credential, role } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required.' });
  }

  try {
    const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google payload');
    }
    const { email, name: username, picture: profilePicture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (user.isSuspended) {
        return res.status(403).json({ message: 'Your account has been suspended. Please contact the administrator.' });
      }
      
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    }

    // Register a new user
    let baseUsername = (username || email.split('@')[0]).replace(/\s+/g, '_').toLowerCase();
    let uniqueUsername = baseUsername;
    let count = 1;
    
    // Ensure username is unique
    while (await User.findOne({ username: uniqueUsername })) {
      uniqueUsername = `${baseUsername}${count}`;
      count++;
    }

    const password = Math.random().toString(36).substring(2, 15);
    const initialRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'pending';
    
    user = new User({
      username: uniqueUsername,
      email,
      password,
      role: initialRole,
      profilePicture
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      isNewUser: true 
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Auth Me Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/auth/profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const { username, bio, profilePicture } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

