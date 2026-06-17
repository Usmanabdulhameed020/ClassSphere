const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createNotification } = require('./notifications');
const Announcement = require('../models/Announcement');
const Assignment = require('../models/Assignment');
const Material = require('../models/Material');
const Submission = require('../models/Submission');
const Class = require('../models/Class');

// @route   GET /api/classroom/my-assignments
router.get('/my-assignments', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const classes = await Class.find({ $or: [{ teachers: userId }, { students: userId }] });
    const classIds = classes.map(c => c._id);
    
    const assignments = await Assignment.find({ classId: { $in: classIds } })
      .populate('classId', 'name color')
      .sort({ dueDate: 1 });
    
    // For students, also fetch their submission status for each
    const submissions = await Submission.find({ studentId: userId });
    
    const data = assignments.map(asgn => {
      const sub = submissions.find(s => s.assignmentId.toString() === asgn._id.toString());
      return {
        ...asgn._doc,
        status: sub ? sub.status : 'Pending',
        submittedGrade: sub ? sub.grade : null
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/classroom/my-materials
router.get('/my-materials', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const classes = await Class.find({ $or: [{ teachers: userId }, { students: userId }] });
    const classIds = classes.map(c => c._id);
    
    const materials = await Material.find({ classId: { $in: classIds } })
      .populate('classId', 'name color')
      .sort({ createdAt: -1 });
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/classroom/:classId/announcements
router.get('/:classId/announcements', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find({ classId: req.params.classId })
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/classroom/:classId/announcements
router.post('/:classId/announcements', auth, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId);
    const newAnnouncement = new Announcement({
      classId: req.params.classId,
      author: req.user.id,
      content: req.body.content,
      attachments: req.body.attachments
    });
    const savedAnnouncement = await newAnnouncement.save();
    
    // Notify students
    cls.students.forEach(async (studentId) => {
      await createNotification({
        recipient: studentId,
        sender: req.user.id,
        type: 'announcement',
        title: 'New Announcement',
        message: `A new announcement has been posted in ${cls.name}.`,
        link: '/dashboard'
      });
    });

    const populated = await savedAnnouncement.populate('author', 'username');
    if (global.io) {
      global.io.to(`class-${req.params.classId}`).emit('announcementCreated', populated);
    }
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/classroom/:classId/assignments
router.get('/:classId/assignments', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ classId: req.params.classId }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/classroom/:classId/assignments
router.post('/:classId/assignments', auth, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId);
    if (!cls.teachers.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not an authorized instructor for this sphere.' });
    }

    const newAssignment = new Assignment({
      classId: req.params.classId,
      author: req.user.id,
      ...req.body
    });
    const savedAssignment = await newAssignment.save();

    // Notify students
    cls.students.forEach(async (studentId) => {
      await createNotification({
        recipient: studentId,
        sender: req.user.id,
        type: 'assignment',
        title: 'New Assignment',
        message: `New assignment: ${req.body.title} in ${cls.name}.`,
        link: '/dashboard'
      });
    });

    if (global.io) {
      global.io.to(`class-${req.params.classId}`).emit('assignmentCreated', savedAssignment);
    }
    res.json(savedAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/classroom/:classId/materials
router.get('/:classId/materials', auth, async (req, res) => {
  try {
    const materials = await Material.find({ classId: req.params.classId }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/classroom/:classId/materials
router.post('/:classId/materials', auth, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId);
    if (!cls.teachers.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not an authorized instructor for this sphere.' });
    }

    const newMaterial = new Material({
      classId: req.params.classId,
      author: req.user.id,
      ...req.body
    });
    const savedMaterial = await newMaterial.save();

    // Notify students
    cls.students.forEach(async (studentId) => {
      await createNotification({
        recipient: studentId,
        sender: req.user.id,
        type: 'assignment',
        title: 'New Material',
        message: `New learning material: ${req.body.title} in ${cls.name}.`,
        link: '/dashboard'
      });
    });

    if (global.io) {
      global.io.to(`class-${req.params.classId}`).emit('materialCreated', savedMaterial);
    }

    res.json(savedMaterial);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/classroom/:classId/people
router.get('/:classId/people', auth, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId)
      .populate('teachers', 'username email profilePicture')
      .populate('students', 'username email profilePicture');
    res.json({ teachers: cls.teachers, students: cls.students });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/classroom/:classId/announcements/:announcementId/comments
router.post('/:classId/announcements/:announcementId/comments', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.announcementId);
    announcement.comments.push({
      author: req.user.id,
      content: req.body.content
    });
    await announcement.save();
    const populated = await announcement.populate('comments.author', 'username');
    res.json(populated.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/classroom/:classId/submissions
router.get('/:classId/submissions', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      assignmentId: { $in: await Assignment.find({ classId: req.params.classId }).distinct('_id') } 
    }).populate('studentId', 'username email').populate('assignmentId', 'title points');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/classroom/submissions/:submissionId/grade
router.patch('/submissions/:submissionId/grade', auth, async (req, res) => {
  const { grade, feedback } = req.body;
  try {
    const submission = await Submission.findById(req.params.submissionId).populate('assignmentId');
    const cls = await Class.findById(submission.assignmentId.classId);
    
    if (!cls.teachers.includes(req.user.id)) {
      return res.status(403).json({ message: 'Only authorized teachers for this class can grade submissions' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'Graded';
    await submission.save();

    // Notify student
    await createNotification({
      recipient: submission.studentId,
      sender: req.user.id,
      type: 'grade',
      title: 'Assignment Graded',
      message: `Your submission for ${submission.assignmentId.title} has been graded: ${grade}/${submission.assignmentId.points}.`,
      link: '/dashboard'
    });
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/classroom/:classId/assignments/:assignmentId/submit
router.post('/:classId/assignments/:assignmentId/submit', auth, async (req, res) => {
  const { content, attachments } = req.body;
  try {
    const cls = await Class.findById(req.params.classId);
    const assignment = await Assignment.findById(req.params.assignmentId);

    const submission = new Submission({
      assignmentId: req.params.assignmentId,
      studentId: req.user.id,
      content,
      attachments,
      status: 'Submitted'
    });

    await submission.save();

    // Notify all teachers of the class
    cls.teachers.forEach(async (teacherId) => {
      await createNotification({
        recipient: teacherId,
        sender: req.user.id,
        type: 'assignment',
        title: 'New Submission',
        message: `${req.user.username} submitted "${assignment.title}".`,
        link: `/dashboard`
      });
    });

    res.json(submission);
  } catch (error) {
    console.error('Submission Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
