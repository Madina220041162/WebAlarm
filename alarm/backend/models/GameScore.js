const mongoose = require('mongoose');

const GameScoreSchema = new mongoose.Schema({
  gameType: { type: String, required: true, enum: ['TypingTest', 'MathDots', 'FlipGrid'] },
  score: { type: Number, required: true },
  accuracy: { type: Number, default: 0 }, // percentage 0-100
  timeSpent: { type: Number, default: 0 }, // in seconds
  difficulty: { type: String, default: 'normal', enum: ['easy', 'normal', 'hard'] },
  details: { type: mongoose.Schema.Types.Mixed, default: {} }, // game-specific details
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Index for efficient leaderboard queries
GameScoreSchema.index({ gameType: 1, score: -1 });
GameScoreSchema.index({ userId: 1, gameType: 1 });

module.exports = mongoose.model('GameScore', GameScoreSchema);
