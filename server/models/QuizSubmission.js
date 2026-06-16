const mongoose = require('mongoose');

const QuizSubmissionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    questionIndex: Number,
    selectedOption: Number,
    isCorrect: Boolean,
  }],
  score: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Graded'],
    default: 'Submitted',
  },
  feedback: String
}, { timestamps: true });

module.exports = mongoose.model('QuizSubmission', QuizSubmissionSchema);
