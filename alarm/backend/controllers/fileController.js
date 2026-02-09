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

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Save metadata to MongoDB
    const fileMeta = new FileMeta({
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
      userId: userId,
    });

    await fileMeta.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: fileMeta._id,
        filename: fileMeta.filename,
        url: fileUrl,
        size: fileMeta.size,
        mimetype: fileMeta.mimetype,
        uploadedAt: fileMeta.uploadedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Get user's uploaded files
exports.getUploadedFiles = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const files = await FileMeta.find({ userId }).sort({ uploadedAt: -1 }).lean();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving files', error: error.message });
  }
};

// Get single file metadata
exports.getFile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fileId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const file = await FileMeta.findOne({ _id: fileId, userId }).lean();
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving file', error: error.message });
  }
};

// Delete uploaded file
exports.deleteFile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fileId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find and verify file ownership
    const fileMeta = await FileMeta.findOne({ _id: fileId, userId });
    if (!fileMeta) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete physical file from filesystem
    const filePath = path.join(uploadsDir, fileMeta.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete metadata from database
    await FileMeta.deleteOne({ _id: fileId });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};
