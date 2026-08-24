const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['SuperAdmin', 'ContentManager', 'SafetyOfficer'], default: 'ContentManager' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  lastLogin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', adminUserSchema);
