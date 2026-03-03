const mongoose = require('mongoose');

const AlarmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: String, required: true }, // Format: "HH:MM" like "07:30"
  label: { type: String, default: 'Alarm' },
  days: { type: [String], default: [] }, // ["Mon", "Tue", etc.]
  soundId: { type: String, default: 'default' },
  isEnabled: { type: Boolean, default: true },
  enabled: { type: Boolean, default: true }, // Legacy field
  triggered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alarm', AlarmSchema);
