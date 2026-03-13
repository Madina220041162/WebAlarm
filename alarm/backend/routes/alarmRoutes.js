const express = require('express');
const alarmController = require('../controllers/alarmController');
const router = express.Router();

router.get('/', alarmController.listAlarms);
router.post('/', alarmController.createAlarm);
router.put('/:id', alarmController.updateAlarm);
router.delete('/:id', alarmController.deleteAlarm);
router.post('/:id/toggle', alarmController.toggleAlarm);
router.delete('/history/past', alarmController.deletePastAlarms);

// The special route for games to stop the alarm
router.post('/dismiss', alarmController.verifyDismissal);

module.exports = router;