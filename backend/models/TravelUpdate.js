const mongoose = require('mongoose');

const travelUpdateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Shuttle', 'Parking', 'Walking Route', 'Road Diversion', 'Advisory'], required: true },
  routeFrom: { type: String },
  routeTo: { type: String },
  status: { type: String, enum: ['Active', 'Resolved', 'Archived'], default: 'Active' },
  occupancyPercentage: { type: Number }, // For parking
  languageVersions: {
    type: Map,
    of: {
      title: String,
      description: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('TravelUpdate', travelUpdateSchema);
