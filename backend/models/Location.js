const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Temple', 'Ghat', 'Toilet', 'Drinking Water', 'Medical Centre', 'Police/Help Centre', 'Parking', 'Food Area', 'Camp/Accommodation', 'Information Centre'],
    required: true 
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  address: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Active', 'Busy', 'Crowded', 'Temporarily Closed'], default: 'Active' },
  verified: { type: Boolean, default: true },
  contactNumber: { type: String },
  languageVersions: {
    type: Map,
    of: {
      name: String,
      description: String,
      address: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
