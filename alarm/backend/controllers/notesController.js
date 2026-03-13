const Note = require('../models/Note');

const ALLOWED_THEMES = new Set(['classic', 'night', 'sepia', 'mint']);
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

function normalizeStyle(rawStyle = {}) {
  const style = rawStyle || {};
  const theme = ALLOWED_THEMES.has(style.theme) ? style.theme : 'classic';
  const paperColor = HEX_COLOR_REGEX.test(style.paperColor || '') ? style.paperColor : '#ffffff';
  const textColor = HEX_COLOR_REGEX.test(style.textColor || '') ? style.textColor : '#1e293b';

  const parsedFontSize = Number(style.fontSize);
  const fontSize = Number.isFinite(parsedFontSize)
    ? Math.min(30, Math.max(12, Math.round(parsedFontSize)))
    : 16;

  return {
    theme,
    paperColor,
    textColor,
    fontSize,
  };
}

// Get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 }).lean();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error reading notes', error: error.message });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags, style } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newNote = new Note({
      userId: req.userId || undefined,
      title,
      content,
      tags: tags || [],
      style: normalizeStyle(style),
    });

    await newNote.save();
    res.status(201).json({ message: 'Note created', note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

// Get a single note
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id).lean();
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving note', error: error.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, style } = req.body;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags !== undefined ? tags : note.tags;
    if (style !== undefined) {
      note.style = normalizeStyle({ ...(note.style || {}), ...style });
    }
    note.updatedAt = new Date();

    await note.save();
    res.status(200).json({ message: 'Note updated', note });
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
};
