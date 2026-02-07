const mongoose = require('mongoose');

const FileMetaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  userId: { type: String, required: false },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FileMeta', FileMetaSchema);
