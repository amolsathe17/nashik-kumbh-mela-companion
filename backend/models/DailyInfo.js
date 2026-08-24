const mongoose = require('mongoose');

const dailyInfoSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format YYYY-MM-DD
  title: { type: String, required: true },
  description: { type: String, required: true },
  programmes: [{
    time: String,
    title: String,
    location: String,
    description: String
  }],
  importantLocations: [String],
  travelAdvisories: [String],
  safetyAdvisories: [String],
  officialNotes: String,
  languageVersions: {
    type: Map,
    of: {
      title: String,
      description: String,
      officialNotes: String,
      status: { type: String, enum: ['Draft', 'Pending Review', 'Approved', 'Published'], default: 'Draft' }
    }
  },
  status: { type: String, enum: ['Draft', 'Scheduled', 'Published', 'Archived'], default: 'Draft' },
  scheduledDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('DailyInfo', dailyInfoSchema);
