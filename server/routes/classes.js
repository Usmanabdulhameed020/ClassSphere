const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/authorize');
const crypto = require('crypto');
const { createNotification } = require('./notifications');

// @route   POST /api/classes
// @desc    Create a new class (Any registered user)
router.post('/', auth, async (req, res) => {
  const { name, section, room, subject, color } = req.body;

  try {
    const code = crypto.randomBytes(3).toString('hex'); // 6 char code
    
    const newClass = new Class({
      name,
      section,
      room,
      subject,
      color,
      creator: req.user.id,
      teachers: [req.user.id], // Automatically add creator as the teacher
      teacherLimit: 1, 
      code,
    });

    const savedClass = await newClass.save();
    res.json(savedClass);
  } catch (error) {
    console.error('Create Class Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/classes
// @desc    Get all classes for current user
router.get('/', auth, async (req, res) => {
  try {
    // Admins see classes they created, teachers/students see classes they joined
    const query = {
      $or: [
        { creator: req.user.id },
        { teachers: req.user.id },
        { students: req.user.id }
      ]
    };

    const classes = await Class.find(query).populate('teachers', 'username email');
    
    res.json(classes);
  } catch (error) {
    console.error('Get Classes Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/classes/join
// @desc    Join a class via code
router.post('/join', auth, async (req, res) => {
  const { code } = req.body;

  try {
    const cls = await Class.findOne({ code });
    if (!cls) return res.status(404).json({ message: 'Class not found' });

    // Ensure creator / co-teachers cannot join as students
    if (cls.creator.toString() === req.user.id.toString() || cls.teachers.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already joined this class as the instructor' });
    }

    // Default to student join
    if (cls.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already joined this class as a student' });
    }
    cls.students.push(req.user.id);

    await cls.save();

    // Create notifications for teachers and creator about the new member
    const recipients = [];
    if (cls.creator) recipients.push(cls.creator);
    if (cls.teachers) {
      cls.teachers.forEach(t => recipients.push(t));
    }

    // Filter duplicates and self
    const uniqueRecipients = Array.from(new Set(recipients.map(r => r.toString())))
      .filter(r => r !== req.user.id.toString());

    for (const recipientId of uniqueRecipients) {
      await createNotification({
        recipient: recipientId,
        sender: req.user.id,
        type: 'system',
        title: 'New Member Enlisted',
        message: `${req.user.username} joined "${cls.name}" as a student.`,
        link: '/dashboard'
      });
    }

    res.json(cls);
  } catch (error) {
    console.error('Join Class Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
