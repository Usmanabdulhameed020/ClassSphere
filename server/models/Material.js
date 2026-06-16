const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
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
  description: String,
  topic: String,
  attachments: [{
    name: String,
    url: String,
    type: String,
  }]
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);
