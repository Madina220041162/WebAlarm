const mongoose = require('mongoose');

const AlarmSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  label: { type: String, default: 'Alarm' },
  enabled: { type: Boolean, default: true },
  triggered: { type: Boolean, default: false },
  userId: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alarm', AlarmSchema);
