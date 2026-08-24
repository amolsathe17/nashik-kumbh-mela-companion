const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, required: true },
  destinationPage: { type: String, default: '/todays-kumbh' },
  targetLanguage: { type: String, default: 'All' },
  languageVersions: {
    type: Map,
    of: {
      title: String,
      message: String
    }
  },
  status: { type: String, enum: ['Draft', 'Scheduled', 'Sent', 'Cancelled'], default: 'Sent' },
  scheduledAt: { type: Date },
  sentAt: { type: Date, default: Date.now },
  deliveryStats: {
    targetCount: { type: Number, default: 0 },
    deliveredCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
