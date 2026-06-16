const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  instructions: String,
  questions: [{
    question: {
      type: String,
      required: true,
    },
    options: [String],
    correctAnswer: {
      type: Number, // Index of the correct option
      required: true,
    },
    points: {
      type: Number,
      default: 1,
    }
  }],
  totalPoints: {
    type: Number,
    required: true,
  },
  dueDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
