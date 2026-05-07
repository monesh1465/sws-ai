import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['success', 'error', 'info', 'warning'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;
