const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
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
  points: {
    type: Number,
    default: 100,
  },
  dueDate: Date,
  topic: String,
  attachments: [{
    name: String,
    url: String,
    type: String,
  }]
}, { timestamps: true });

// Add index for performance
AssignmentSchema.index({ classId: 1 });

module.exports = mongoose.model('Assignment', AssignmentSchema);
