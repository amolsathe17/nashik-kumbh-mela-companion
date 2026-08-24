const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Accommodation', 'Food Area', 'Drinking Water', 'Toilet', 'Medical', 'Pharmacy', 'Parking', 'Information Centre', 'Police Centre'],
    required: true 
  },
  location: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number
  },
  verified: { type: Boolean, default: true },
  status: { type: String, enum: ['Open', 'Busy', 'Closed'], default: 'Open' },
  contactPhone: { type: String },
  capacityNotes: { type: String },
  languageVersions: {
    type: Map,
    of: {
      name: String,
      location: String,
      capacityNotes: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);
