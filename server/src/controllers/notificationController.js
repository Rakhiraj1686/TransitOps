const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// Get all notifications
const getNotifications = asyncHandler(async (req, res) => {
  // const notifications = await Notification.find({
  //   user: req.user._id,
  // }).sort({ createdAt: -1 });
  const notifications = await Notification.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

// Mark one notification as read
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  await notification.save();

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

// Mark all as read
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      user: req.user._id,
      isRead: false,
    },
    {
      isRead: true,
    }
  );

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
});

// Delete notification
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  await notification.deleteOne();

  res.json({
    success: true,
    message: 'Notification deleted',
  });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};