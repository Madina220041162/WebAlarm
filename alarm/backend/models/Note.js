const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  style: {
    theme: {
      type: String,
      enum: ['classic', 'night', 'sepia', 'mint'],
      default: 'classic',
    },
    paperColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#1e293b' },
    fontSize: { type: Number, default: 16 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', NoteSchema);
