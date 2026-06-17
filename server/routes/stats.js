const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Class = require('../models/Class');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// @route   GET /api/stats/summary
// @desc    Get dashboard summary stats based on role
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const role = req.user.role;
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    const teacherClasses = await Class.find({ teachers: userId });
    const studentClasses = await Class.find({ students: userId });

    if (teacherClasses.length > 0) {
      const classIds = teacherClasses.map(c => c._id);

      const [totalAssignments, attendanceRecords, assignmentIds] = await Promise.all([
        Assignment.countDocuments({ classId: { $in: classIds } }),
        Attendance.find({ classId: { $in: classIds }, date: { $gte: lastMonth } }),
        Assignment.find({ classId: { $in: classIds } }).distinct('_id')
      ]);

      const pendingSubmissions = await Submission.countDocuments({ 
        assignmentId: { $in: assignmentIds },
        status: 'Submitted'
      });

      const totalStudents = teacherClasses.reduce((acc, c) => acc + c.students.length, 0);
      
      let totalPossible = 0;
      let actualPresent = 0;
      attendanceRecords.forEach(rec => {
        rec.records.forEach(r => {
          totalPossible++;
          if (r.status === 'Present' || r.status === 'Late') actualPresent++;
        });
      });

      const attendanceRate = totalPossible > 0 ? Math.round((actualPresent / totalPossible) * 100) : 100;

      res.json({
        totalClasses: teacherClasses.length,
        totalStudents,
        totalAssignments,
        pendingSubmissions,
        attendanceRate: `${attendanceRate}%`,
        trend: '+5%'
      });

    } else {
      const classIds = studentClasses.map(c => c._id);

      const [assignments, submissions, attendanceRecords] = await Promise.all([
        Assignment.find({ classId: { $in: classIds } }),
        Submission.find({ studentId: userId }),
        Attendance.find({ classId: { $in: classIds } })
      ]);
      
      const completed = submissions.filter(s => s.status === 'Graded' || s.status === 'Submitted').length;
      const upcoming = assignments.length - completed;

      const gradedSubmissions = submissions.filter(s => s.grade !== undefined);
      const avgGrade = gradedSubmissions.length > 0 
        ? Math.round(gradedSubmissions.reduce((acc, s) => acc + s.grade, 0) / gradedSubmissions.length) 
        : 0;

      let studentPresent = 0;
      let studentTotal = 0;
      attendanceRecords.forEach(rec => {
        const myRec = rec.records.find(r => r.studentId.toString() === req.user.id);
        if (myRec) {
          studentTotal++;
          if (myRec.status === 'Present' || myRec.status === 'Late') studentPresent++;
        }
      });

      const attendanceRate = studentTotal > 0 ? Math.round((studentPresent / studentTotal) * 100) : 100;

      res.json({
        enrolledClasses: studentClasses.length,
        upcomingTasks: upcoming,
        completedTasks: completed,
        avgGrade: `${avgGrade}%`,
        attendanceRate: `${attendanceRate}%`,
        trend: '+2%'
      });
    }
  } catch (error) {
    console.error('Stats Summary Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stats/engagement
router.get('/engagement', auth, async (req, res) => {
  try {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    
    const dayQueries = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0,0,0,0));
      const end = new Date(date.setHours(23,59,59,999));
      
      dayQueries.push(Promise.all([
        Submission.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        Attendance.countDocuments({ createdAt: { $gte: start, $lte: end } })
      ]).then(([submissions, attendance]) => ({
        name: days[date.getDay()],
        engagement: (submissions + attendance) * 10 + Math.floor(Math.random() * 50)
      })));
    }

    const data = await Promise.all(dayQueries);
    res.json(data);
  } catch (error) {
    console.error('Engagement Stats Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
