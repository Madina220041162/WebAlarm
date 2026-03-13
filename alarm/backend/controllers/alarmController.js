const Alarm = require('../models/Alarm');

// List all alarms
exports.listAlarms = async (req, res) => {
  try {
    const alarms = await Alarm.find().sort({ time: 1 }).lean();
    res.status(200).json(alarms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alarms', error: error.message });
  }
};

// Create a new alarm
exports.createAlarm = async (req, res) => {
  try {
    const { time, label, userId, sound } = req.body;
    if (!time) return res.status(400).json({ message: 'Time is required' });

    const alarm = new Alarm({ 
      time: new Date(time), 
      label: label || 'Alarm Battle', 
      userId,
      sound: sound || 'rooster'
    });

    await alarm.save();
    res.status(201).json({ message: 'Alarm created', alarm });
  } catch (error) {
    res.status(500).json({ message: 'Error creating alarm', error: error.message });
  }
};

// Update an alarm
exports.updateAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const { time, label, enabled, sound, sleeperType } = req.body;

    const alarm = await Alarm.findById(id);
    if (!alarm) return res.status(404).json({ message: 'Alarm not found' });

    if (time) {
      const parsedTime = new Date(time);
      if (Number.isNaN(parsedTime.getTime())) {
        return res.status(400).json({ message: 'Invalid time value' });
      }
      alarm.time = parsedTime;
      // Re-arm if time changes
      alarm.triggered = false;
    }

    if (label !== undefined) alarm.label = label || 'Alarm Battle';
    if (enabled !== undefined) alarm.enabled = Boolean(enabled);
    if (sound !== undefined) alarm.sound = sound;
    if (sleeperType !== undefined) alarm.sleeperType = sleeperType;

    await alarm.save();
    res.status(200).json({ message: 'Alarm updated', alarm });
  } catch (error) {
    res.status(500).json({ message: 'Update error', error: error.message });
  }
};

// Toggle alarm enabled/disabled
exports.toggleAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const alarm = await Alarm.findById(id);
    if (!alarm) return res.status(404).json({ message: 'Alarm not found' });
    
    alarm.enabled = !alarm.enabled;
    await alarm.save();
    res.status(200).json({ message: 'Status updated', alarm });
  } catch (error) {
    res.status(500).json({ message: 'Toggle error', error: error.message });
  }
};

// Delete an alarm
exports.deleteAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Alarm.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Alarm not found' });
    res.status(200).json({ message: 'Alarm deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete error', error: error.message });
  }
};

// Delete all alarms in the past (history cleanup)
exports.deletePastAlarms = async (req, res) => {
  try {
    const now = new Date();
    const result = await Alarm.deleteMany({ time: { $lt: now } });
    res.status(200).json({ message: 'Past alarms deleted', deletedCount: result.deletedCount || 0 });
  } catch (error) {
    res.status(500).json({ message: 'History cleanup error', error: error.message });
  }
};

/**
 * MISSION CRITICAL: Verify Dismissal
 * This is called after the frontend AI check (doesPredictionMatchTarget)
 */
exports.verifyDismissal = async (req, res) => {
  try {
    const { alarmId, challengeType, success, topPrediction } = req.body;

    // If the frontend AI failed the check, the backend refuses to delete the alarm
    if (!success) {
      return res.status(403).json({ 
        message: 'Neural verification failed. Required object not found.',
        success: false 
      });
    }

    // Success: Delete the alarm to silence it
    const alarm = await Alarm.findByIdAndDelete(alarmId);
    
    if (!alarm) {
      return res.status(404).json({ 
        message: 'Alarm already dismissed or does not exist.',
        success: false 
      });
    }

    console.log(`[SYSTEM] Alarm ${alarmId} dismissed via ${challengeType}. Detected: ${topPrediction}`);
    
    res.status(200).json({ 
      message: 'Mission Accomplished. Alarm deactivated.', 
      success: true 
    });

  } catch (error) {
    console.error('Critical Dismissal Error:', error);
    res.status(500).json({ message: 'Server error during dismissal', error: error.message });
  }
};