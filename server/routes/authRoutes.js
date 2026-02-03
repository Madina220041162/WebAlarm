import express from 'express'
import { register, login, getProfile } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Auth endpoints
router.post('/register', register)
router.post('/login', login)
router.get('/me', authMiddleware, getProfile)

export default router