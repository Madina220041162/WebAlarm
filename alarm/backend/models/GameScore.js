const mongoose = require('mongoose');

const GameScoreSchema = new mongoose.Schema({
  gameType: { type: String, required: true },
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  userId: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GameScore', GameScoreSchema);
