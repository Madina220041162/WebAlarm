const Alarm = require('../models/Alarm');

let _io;
let _interval;

const checkDueAlarms = async () => {
  try {
    const now = new Date();
    // Find alarms that are enabled, not yet triggered, and time <= now
    const due = await Alarm.find({ enabled: true, triggered: false, time: { $lte: now } });
    for (const alarm of due) {
      // Mark triggered
      alarm.triggered = true;
      await alarm.save();
      // Emit event to all connected clients with all alarm data
      if (_io) {
        _io.emit('alarmTriggered', { 
          id: alarm._id, 
          time: alarm.time, 
          label: alarm.label,
          sound: alarm.sound,
          sleeperType: alarm.sleeperType
        });
        console.log('Alarm triggered:', alarm._id, alarm.label);
      }
    }
  } catch (err) {
    console.error('Alarm scheduler error:', err.message);
  }
};

function startAlarmScheduler(io, intervalMs = 5000) {
  if (_interval) clearInterval(_interval);
  _io = io;
  _interval = setInterval(checkDueAlarms, intervalMs);
  console.log('Alarm scheduler started (interval ms):', intervalMs);
}

function stopAlarmScheduler() {
  if (_interval) clearInterval(_interval);
  _interval = null;
}

module.exports = { startAlarmScheduler, stopAlarmScheduler };
