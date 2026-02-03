import Note from '../models/Note.js'

// Get all notes for user
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId })
    res.json({ notes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get note by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    // Check if user owns the note
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    res.json({ note })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body

    const note = new Note({
      title,
      content,
      userId: req.userId
    })

    await note.save()
    res.status(201).json({ message: 'Note created', note })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update note
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    note.title = req.body.title || note.title
    note.content = req.body.content || note.content
    note.updatedAt = Date.now()

    await note.save()
    res.json({ message: 'Note updated', note })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await Note.deleteOne({ _id: req.params.id })
    res.json({ message: 'Note deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}