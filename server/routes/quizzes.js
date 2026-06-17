const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const { createNotification } = require('./notifications');

// @route   GET /api/quizzes/:classId
// @desc    Get all quizzes for a class
router.get('/:classId', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ classId: req.params.classId }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quizzes/:classId
// @desc    Create a new quiz
router.post('/:classId', auth, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.classId);
    if (!cls.teachers.includes(req.user.id)) {
      return res.status(403).json({ message: 'Only teachers can create quizzes' });
    }

    const newQuiz = new Quiz({
      classId: req.params.classId,
      author: req.user.id,
      ...req.body
    });
    const savedQuiz = await newQuiz.save();
    if (global.io) {
      global.io.to(`class-${req.params.classId}`).emit('quizCreated', savedQuiz);
    }
    res.json(savedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quizzes/quiz/:quizId
// @desc    Get a specific quiz
router.get('/quiz/:quizId', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quizzes/quiz/:quizId/submit
// @desc    Submit a quiz attempt
router.post('/quiz/:quizId/submit', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { answers } = req.body;
    let score = 0;
    const processedAnswers = answers.map(ans => {
      const question = quiz.questions[ans.questionIndex];
      const isCorrect = question.correctAnswer === ans.selectedOption;
      if (isCorrect) score += question.points;
      return { ...ans, isCorrect };
    });

    const submission = new QuizSubmission({
      quizId: req.params.quizId,
      studentId: req.user.id,
      answers: processedAnswers,
      score,
      status: 'Graded'
    });

    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quizzes/quiz/:quizId/submissions
// @desc    Get all submissions for a quiz (teachers get all, students get only their own)
router.get('/quiz/:quizId/submissions', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const cls = await Class.findById(quiz.classId);
    const isTeacher = cls && cls.teachers.includes(req.user.id);
    if (!isTeacher) {
      query.studentId = req.user.id;
    }
    const submissions = await QuizSubmission.find(query)
      .populate('studentId', 'username email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quizzes/class/:classId/submissions
// @desc    Get all quiz submissions for a class (teachers get all, students get only their own)
router.get('/class/:classId/submissions', auth, async (req, res) => {
  try {
    const quizIds = await Quiz.find({ classId: req.params.classId }).distinct('_id');
    const query = { quizId: { $in: quizIds } };
    const cls = await Class.findById(req.params.classId);
    const isTeacher = cls && cls.teachers.includes(req.user.id);
    if (!isTeacher) {
      query.studentId = req.user.id;
    }
    const submissions = await QuizSubmission.find(query)
      .populate('studentId', 'username email')
      .populate('quizId', 'title totalPoints');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/quizzes/submissions/:submissionId/grade
// @desc    Grade a quiz submission (teacher only)
router.patch('/submissions/:submissionId/grade', auth, async (req, res) => {
  const { score, feedback } = req.body;
  try {
    const submission = await QuizSubmission.findById(req.params.submissionId).populate('quizId');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    const cls = await Class.findById(submission.quizId.classId);
    if (!cls.teachers.includes(req.user.id)) {
      return res.status(403).json({ message: 'Only authorized teachers for this class can grade submissions' });
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'Graded';
    await submission.save();

    // Notify student
    await createNotification({
      recipient: submission.studentId,
      sender: req.user.id,
      type: 'grade',
      title: 'Quiz Graded',
      message: `Your quiz "${submission.quizId.title}" has been graded: ${score}/${submission.quizId.totalPoints}.`,
      link: '/dashboard'
    });

    res.json(submission);
  } catch (error) {
    console.error('Quiz Grading Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
