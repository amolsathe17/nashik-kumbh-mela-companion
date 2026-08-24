const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Daily Kumbh Information', 'Programme Information', 'Official Announcements', 'Travel Updates', 'Safety Advisories', 'Important Alerts'],
    default: 'Official Announcements' 
  },
  priority: { type: String, enum: ['Normal', 'High', 'Emergency'], default: 'Normal' },
  languageVersions: {
    type: Map,
    of: {
      title: String,
      message: String,
      status: { type: String, enum: ['Draft', 'Approved', 'Published'], default: 'Approved' }
    }
  },
  status: { type: String, enum: ['Draft', 'Scheduled', 'Published', 'Archived'], default: 'Published' },
  scheduledDate: { type: Date },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
