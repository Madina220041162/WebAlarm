const fs = require('fs');
const path = require('path');
const FileMeta = require('../models/FileMeta');

const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Save metadata to MongoDB
    try {
      const doc = new FileMeta({
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
        userId: req.userId || undefined,
      });
      await doc.save();
    } catch (err) {
      console.warn('Failed to save file metadata to DB:', err.message);
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Get list of uploaded files
exports.getUploadedFiles = async (req, res) => {
  try {
    // Try DB first
    try {
      const docs = await FileMeta.find().sort({ uploadedAt: -1 }).lean();
      if (docs && docs.length > 0) return res.status(200).json(docs);
    } catch (err) {
      console.warn('Failed to read file metadata from DB:', err.message);
    }

    // Fallback to filesystem
    const files = fs.readdirSync(uploadsDir).map((filename) => {
      const filePath = path.join(uploadsDir, filename);
      const stat = fs.statSync(filePath);
      return {
        filename,
        url: `/uploads/${filename}`,
        size: stat.size,
        uploadedAt: stat.mtime.toISOString(),
      };
    });

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving files', error: error.message });
  }
};

// Delete uploaded file
exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Prevent directory traversal
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: 'Invalid file path' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    fs.unlinkSync(filePath);

    // Remove metadata from DB if present
    try {
      await FileMeta.deleteOne({ filename });
    } catch (err) {
      console.warn('Failed to remove file metadata from DB:', err.message);
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};
