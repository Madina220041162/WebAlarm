const mongoose = require('mongoose');

const CalendarEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  color: { type: String, default: '#667eea' },
  isAllDay: { type: Boolean, default: false },
  reminder: { type: Boolean, default: true },
  reminderTime: { type: Number, default: 15 }, // minutes before event
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CalendarEvent', CalendarEventSchema);
