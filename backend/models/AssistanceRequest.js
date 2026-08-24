const mongoose = require('mongoose');

const assistanceRequestSchema = new mongoose.Schema({
  requestType: { 
    type: String, 
    enum: ['General Assistance', 'Lost & Found', 'Medical Support', 'Senior Citizen Support', 'Directions Help', 'Other'],
    required: true 
  },
  requesterName: { type: String, required: true },
  contactInfo: { type: String, required: true },
  locationDescription: { type: String },
  description: { type: String, required: true },
  status: { type: String, enum: ['New', 'In Progress', 'Resolved'], default: 'New' },
  internalNotes: { type: String, default: '' },
  assignedTo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('AssistanceRequest', assistanceRequestSchema);
