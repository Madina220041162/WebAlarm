const Alarm = require('../models/Alarm');

exports.createAlarm = async (req, res) => {
  try {
    const { time, label, userId } = req.body;
    if (!time) return res.status(400).json({ message: 'time is required' });

    const alarm = new Alarm({ time: new Date(time), label: label || 'Alarm', userId });
    await alarm.save();
    res.status(201).json({ message: 'Alarm created', alarm });
  } catch (error) {
    res.status(500).json({ message: 'Error creating alarm', error: error.message });
  }
};

exports.listAlarms = async (req, res) => {
  try {
    const alarms = await Alarm.find().sort({ time: 1 }).lean();
    res.status(200).json(alarms);
  } catch (error) {
    res.status(500).json({ message: 'Error listing alarms', error: error.message });
  }
};

exports.deleteAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    await Alarm.findByIdAndDelete(id);
    res.status(200).json({ message: 'Alarm deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alarm', error: error.message });
  }
};

exports.toggleAlarm = async (req, res) => {
  try {
    const { id } = req.params;
    const alarm = await Alarm.findById(id);
    if (!alarm) return res.status(404).json({ message: 'Alarm not found' });
    alarm.enabled = !alarm.enabled;
    await alarm.save();
    res.status(200).json({ message: 'Alarm toggled', alarm });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling alarm', error: error.message });
  }
};
