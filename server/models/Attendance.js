const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  records: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      default: 'Present',
    },
    note: String,
  }],
}, { timestamps: true });

// Ensure one attendance record per class per day
AttendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
