const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String, // ID of the user who will receive the notification
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String, // e.g., 'like', 'comment', 'favorite'
    required: true
  },
  recipeId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
