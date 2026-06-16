const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  section: String,
  room: String,
  subject: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  teacherLimit: {
    type: Number,
    default: 1,
  },
  color: {
    type: String,
    default: 'bg-teal-600',
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  code: {
    type: String,
    unique: true,
  }
}, { timestamps: true });

// Add indexes for performance
ClassSchema.index({ teachers: 1 });
ClassSchema.index({ students: 1 });

module.exports = mongoose.model('Class', ClassSchema);
