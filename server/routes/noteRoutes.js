import express from 'express'
import { getNotes, getNoteById, createNote, updateNote, deleteNote } from '../controllers/noteController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Note endpoints
router.get('/', authMiddleware, getNotes)
router.get('/:id', authMiddleware, getNoteById)
router.post('/', authMiddleware, createNote)
router.put('/:id', authMiddleware, updateNote)
router.delete('/:id', authMiddleware, deleteNote)

export default router