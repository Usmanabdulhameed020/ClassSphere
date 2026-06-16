const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Utility function to create a notification (to be exported/used by other routes)
const createNotification = async ({ recipient, sender, type, title, message, link }) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      type,
      title,
      message,
      link
    });
    await notification.save();

    // Send in real-time via Socket.io if recipient is connected
    if (global.io && global.connectedUsers) {
      const recipientSocketId = global.connectedUsers.get(recipient.toString());
      if (recipientSocketId) {
        global.io.to(recipientSocketId).emit('receiveNotification', notification);
      }
    }

    return notification;
  } catch (error) {
    console.error('Create Notification Error:', error);
  }
};

// @route   GET /api/notifications
// @desc    Get user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
    
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/notifications/read-all
// @desc    Mark all user's notifications as read
router.patch('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.id }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
    res.json({ message: 'Notification removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  router,
  createNotification
};
