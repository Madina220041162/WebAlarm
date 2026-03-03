const express = require('express');
const alarmController = require('../controllers/alarmController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All alarm routes require authentication
router.get('/', authMiddleware, alarmController.getAllAlarms);
router.post('/', authMiddleware, alarmController.createAlarm);
router.get('/:id', authMiddleware, alarmController.getAlarm);
router.put('/:id', authMiddleware, alarmController.updateAlarm);
router.delete('/:id', authMiddleware, alarmController.deleteAlarm);
router.put('/:id/toggle', authMiddleware, alarmController.toggleAlarm);

module.exports = router;
