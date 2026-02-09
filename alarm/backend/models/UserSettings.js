const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  notifications: { type: Boolean, default: true },
  soundEnabled: { type: Boolean, default: true },
  language: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);
