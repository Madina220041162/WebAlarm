const express = require('express');
const alarmController = require('../controllers/alarmController');

const router = express.Router();

router.get('/', alarmController.listAlarms);
router.post('/', alarmController.createAlarm);
router.delete('/:id', alarmController.deleteAlarm);
router.post('/:id/toggle', alarmController.toggleAlarm);

module.exports = router;
