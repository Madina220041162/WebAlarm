const Note = require('../models/Note');

// Get all notes for the current user
exports.getAllNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const notes = await Note.find({ userId }).sort({ createdAt: -1 }).lean();
    res.status(200).json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Error reading notes', error: error.message });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, content, tags, color } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newNote = new Note({
      userId,
      title,
      content,
      tags: tags || [],
      color: color || '#FFE8A8',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newNote.save();
    res.status(201).json({ message: 'Note created', note: newNote });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

// Get a single note
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const note = await Note.findOne({ _id: id, userId }).lean();
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Error retrieving note', error: error.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, content, tags, color } = req.body;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (color) note.color = color;
    note.updatedAt = new Date();

    await note.save();
    res.status(200).json({ message: 'Note updated', note });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const note = await Note.findOneAndDelete({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
};
