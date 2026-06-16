const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// @route   GET /api/chat/:classId
// @desc    Get chat history for a class
router.get('/:classId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ classId: req.params.classId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username role profilePicture');
    
    res.json(messages.reverse());
  } catch (error) {
    console.error('Chat History Error:', error);
    res.status(500).json({ message: 'Server error fetching chat history' });
  }
});

module.exports = router;
