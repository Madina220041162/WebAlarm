const mongoose = require('mongoose');
const Alarm = require('../models/Alarm');

// Get all alarms for the current user
exports.getAllAlarms = async (req, res) => {
  try {
    const userId = req.userId;
    
    const objectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;
    
    const alarms = await Alarm.find({ userId: objectId }).sort({ createdAt: -1 });
    res.status(200).json(alarms);
  } catch (error) {
    console.error('Get alarms error:', error);
    res.status(500).json({ message: 'Error reading alarms', error: error.message });
  }
};

exports.listAlarms = async (req, res) => {
  // Alias for getAllAlarms
  exports.getAllAlarms(req, res);
};

// Create a new alarm
exports.createAlarm = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { time, label, days, soundId, isEnabled } = req.body;

    if (!time) {
      return res.status(400).json({ message: 'Time is required' });
    }

    // Convert userId to ObjectId if it's a string
    const objectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const alarmData = {
      userId: objectId,
      time,
      label: label || 'Alarm',
      days: Array.isArray(days) ? days : [],
      soundId: soundId || 'default',
      isEnabled: isEnabled !== undefined ? isEnabled : true,
    };

    console.log('Creating alarm with data:', alarmData);

    const newAlarm = new Alarm(alarmData);
    await newAlarm.save();
    
    console.log('Alarm created successfully:', newAlarm);
    res.status(201).json({ message: 'Alarm created', alarm: newAlarm });
  } catch (error) {
    console.error('Create alarm error - Full details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    res.status(500).json({ 
      message: 'Error creating alarm', 
      error: error.message,
      details: error.errors ? Object.keys(error.errors) : 'unknown'
    });
  }
};

// Get a single alarm
exports.getAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const objectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;
    
    const alarm = await Alarm.findOne({ _id: id, userId: objectId });
    if (!alarm) {
      return res.status(404).json({ message: 'Alarm not found' });
    }
    
    res.status(200).json(alarm);
  } catch (error) {
    console.error('Get alarm error:', error);
    res.status(500).json({ message: 'Error retrieving alarm', error: error.message });
  }
};

// Update an alarm
exports.updateAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { time, label, days, soundId, isEnabled, enabled } = req.body;

    const objectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const alarm = await Alarm.findOne({ _id: id, userId: objectId });
    if (!alarm) {
      return res.status(404).json({ message: 'Alarm not found' });
    }

    if (time !== undefined) alarm.time = time;
    if (label !== undefined) alarm.label = label;
    if (days !== undefined) alarm.days = days;
    if (soundId !== undefined) alarm.soundId = soundId;
    if (isEnabled !== undefined) alarm.isEnabled = isEnabled;
    if (enabled !== undefined) alarm.enabled = enabled; // Legacy support
    alarm.updatedAt = new Date();

    await alarm.save();
    res.status(200).json({ message: 'Alarm updated', alarm });
  } catch (error) {
    console.error('Update alarm error:', error);
    res.status(500).json({ message: 'Error updating alarm', error: error.message });
  }
};

// Delete an alarm
exports.deleteAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const objectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;
    
    const alarm = await Alarm.findOneAndDelete({ _id: id, userId: objectId });
    if (!alarm) {
      return res.status(404).json({ message: 'Alarm not found' });
    }
    
    res.status(200).json({ message: 'Alarm deleted' });
  } catch (error) {
    console.error('Delete alarm error:', error);
    res.status(500).json({ message: 'Error deleting alarm', error: error.message });
  }
};

// Toggle alarm enable/disable
exports.toggleAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const objectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;
    
    const alarm = await Alarm.findOne({ _id: id, userId: objectId });
    if (!alarm) {
      return res.status(404).json({ message: 'Alarm not found' });
    }
    
    alarm.isEnabled = !alarm.isEnabled;
    if (alarm.enabled !== undefined) alarm.enabled = !alarm.enabled; // Legacy support
    alarm.updatedAt = new Date();
    await alarm.save();
    
    res.status(200).json({ message: 'Alarm toggled', alarm });
  } catch (error) {
    console.error('Toggle alarm error:', error);
    res.status(500).json({ message: 'Error toggling alarm', error: error.message });
  }
};
