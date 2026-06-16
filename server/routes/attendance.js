const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const { createNotification } = require('./notifications');

// @route   GET /api/attendance/:classId
// @desc    Get attendance records for a class
router.get('/:classId', auth, async (req, res) => {
  try {
    const { date } = req.query;
    let query = { classId: req.params.classId };
    
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await Attendance.find(query)
      .populate('records.studentId', 'username email')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    console.error('Get Attendance Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/attendance/:classId
// @desc    Mark attendance for a class
router.post('/:classId', auth, async (req, res) => {
  const { date, records } = req.body;

  try {
    // Check if user is teacher of the class
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can mark attendance' });
    }

    const cls = await Class.findById(req.params.classId);
    if (!cls.teachers.includes(req.user.id)) {
      return res.status(403).json({ message: 'Only authorized teachers for this class can mark attendance' });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    let attendance = await Attendance.findOne({
      classId: req.params.classId,
      date: { $gte: start, $lte: end }
    });

    if (attendance) {
      attendance.records = records;
      await attendance.save();
    } else {
      attendance = new Attendance({
        classId: req.params.classId,
        date: new Date(date),
        records
      });
      await attendance.save();
    }

    const populated = await attendance.populate('records.studentId', 'username email');
    
    // Trigger notifications for students
    records.forEach(async (record) => {
      await createNotification({
        recipient: record.studentId,
        sender: req.user.id,
        type: 'attendance',
        title: 'Attendance Updated',
        message: `Your attendance for ${cls.name} on ${new Date(date).toLocaleDateString()} has been marked as ${record.status}.`,
        link: '/dashboard?tab=Attendance'
      });
    });

    res.json(populated);
  } catch (error) {
    console.error('Mark Attendance Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attendance/:classId/student/:studentId
// @desc    Get attendance summary for a specific student in a class
router.get('/:classId/student/:studentId', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({
      classId: req.params.classId,
      'records.studentId': req.params.studentId
    });

    const summary = attendance.map(a => {
      const record = a.records.find(r => r.studentId.toString() === req.params.studentId);
      return {
        date: a.date,
        status: record.status,
        note: record.note
      };
    });

    res.json(summary);
  } catch (error) {
    console.error('Student Attendance Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
