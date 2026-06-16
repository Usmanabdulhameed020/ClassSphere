const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const PrivateMessage = require('../models/PrivateMessage');
const User = require('../models/User');
const Class = require('../models/Class');


// @route   GET /api/messages/conversations
// @desc    Get all conversations for the current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'username profilePicture role')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await PrivateMessage.countDocuments({
          conversationId: conv._id,
          sender: { $ne: req.user.id },
          isRead: false
        });
        return {
          ...conv.toObject(),
          unreadCount
        };
      })
    );

    res.json(conversationsWithUnread);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/:conversationId
// @desc    Get messages for a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Mark messages sent by the other participant in this conversation as read
    const result = await PrivateMessage.updateMany(
      { conversationId: req.params.conversationId, sender: { $ne: req.user.id }, isRead: false },
      { $set: { isRead: true } }
    );

    // If any messages were marked as read, notify the sender via socket
    if (result.modifiedCount > 0 && global.io && global.connectedUsers) {
      const otherParticipantId = conversation.participants.find(p => p.toString() !== req.user.id);
      if (otherParticipantId) {
        const otherSocketId = global.connectedUsers.get(otherParticipantId.toString());
        if (otherSocketId) {
          global.io.to(otherSocketId).emit('privateMessagesRead', {
            conversationId: conversation._id,
            readerId: req.user.id
          });
        }
      }
    }

    const messages = await PrivateMessage.find({
      conversationId: req.params.conversationId
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Fetch Messages Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/messages
// @desc    Send a private message (creates conversation if not exists)
router.post('/', auth, async (req, res) => {
  const { recipientId, content } = req.body;

  try {
    // 1. Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.id, recipientId]
      });
      await conversation.save();
    }

    // 2. Create message
    const message = new PrivateMessage({
      conversationId: conversation._id,
      sender: req.user.id,
      content
    });

    await message.save();

    // 3. Update conversation lastMessage
    conversation.lastMessage = message._id;
    conversation.updatedAt = Date.now();
    await conversation.save();

    // Send in real-time via Socket.io
    if (global.io && global.connectedUsers) {
      const recipientSocketId = global.connectedUsers.get(recipientId.toString());
      if (recipientSocketId) {
        global.io.to(recipientSocketId).emit('receivePrivateMessage', message);
      }
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/users/search
// @desc    Search for users to start a conversation (everyone can see all users)
router.get('/users/search', auth, async (req, res) => {
  const { q } = req.query;
  try {
    let query = { _id: { $ne: req.user.id } };

    if (q) {
      query.username = { $regex: q, $options: 'i' };
    }

    const users = await User.find(query).select('username role profilePicture').limit(10);
    res.json(users);
  } catch (error) {
    console.error('Search Users Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
