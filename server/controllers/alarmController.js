import Alarm from '../models/Alarm.js'

// Get all alarms for user
export const getAlarms = async (req, res) => {
  try {
    const alarms = await Alarm.find({ userId: req.userId })
    res.json({ alarms })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create alarm
export const createAlarm = async (req, res) => {
  try {
    const { title, time } = req.body

    const alarm = new Alarm({
      title,
      time,
      userId: req.userId
    })

    await alarm.save()
    res.status(201).json({ message: 'Alarm created', alarm })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update alarm
export const updateAlarm = async (req, res) => {
  try {
    const alarm = await Alarm.findById(req.params.id)
    if (!alarm) {
      return res.status(404).json({ message: 'Alarm not found' })
    }

    if (alarm.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    alarm.title = req.body.title || alarm.title
    alarm.time = req.body.time || alarm.time
    alarm.enabled = req.body.enabled !== undefined ? req.body.enabled : alarm.enabled

    await alarm.save()
    res.json({ message: 'Alarm updated', alarm })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete alarm
export const deleteAlarm = async (req, res) => {
  try {
    const alarm = await Alarm.findById(req.params.id)
    if (!alarm) {
      return res.status(404).json({ message: 'Alarm not found' })
    }

    if (alarm.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await Alarm.deleteOne({ _id: req.params.id })
    res.json({ message: 'Alarm deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}