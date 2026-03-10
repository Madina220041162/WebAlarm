const express = require('express');
const alarmController = require('../controllers/alarmController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', alarmController.listAlarms);
router.post('/', authMiddleware, alarmController.createAlarm);
router.put('/:id', authMiddleware, alarmController.updateAlarm);
router.delete('/:id', authMiddleware, alarmController.deleteAlarm);
router.post('/:id/toggle', authMiddleware, alarmController.toggleAlarm);

module.exports = router;
