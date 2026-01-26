import express from 'express'
import { getAlarms, createAlarm, updateAlarm, deleteAlarm } from '../controllers/alarmController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

// Alarm endpoints
router.get('/', authMiddleware, getAlarms)
router.post('/', authMiddleware, createAlarm)
router.put('/:id', authMiddleware, updateAlarm)
router.delete('/:id', authMiddleware, deleteAlarm)

export default router