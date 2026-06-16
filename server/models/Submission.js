const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: String,
  attachments: [{
    name: String,
    url: String,
    type: String,
  }],
  grade: Number,
  feedback: String,
  status: {
    type: String,
    enum: ['Submitted', 'Late', 'Graded', 'Returned'],
    default: 'Submitted'
  }
}, { timestamps: true });

// Add indexes for performance
SubmissionSchema.index({ assignmentId: 1 });
SubmissionSchema.index({ studentId: 1 });
SubmissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Submission', SubmissionSchema);
