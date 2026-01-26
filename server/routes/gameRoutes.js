import express from 'express'
import { getScores, submitScore, getLeaderboard } from '../controllers/gameController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Game endpoints
router.get('/scores', authMiddleware, getScores)
router.post('/scores', authMiddleware, submitScore)
router.get('/leaderboard', getLeaderboard)

export default router