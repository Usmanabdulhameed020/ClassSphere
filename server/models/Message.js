const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: String,
  senderRole: String,
  senderProfilePicture: String,
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'file', 'announcement'],
    default: 'text'
  },
  attachments: [{
    name: String,
    url: String,
    fileType: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Message', MessageSchema);
