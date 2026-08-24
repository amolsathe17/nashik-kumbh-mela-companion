const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Shahi Snan', 'Ritual Guide', 'Temple Guide', 'Ghat Guide', 'Cultural Info', 'International Visitor Guide'],
    required: true 
  },
  eventDate: { type: String }, // e.g. "2026-09-14" or descriptive
  location: { type: String },
  description: { type: String, required: true },
  guidelines: [String],
  importance: { type: String },
  languageVersions: {
    type: Map,
    of: {
      title: String,
      description: String,
      importance: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);
