import mongoose from 'mongoose'

// Alarm schema for MongoDB
const alarmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Alarm', alarmSchema)