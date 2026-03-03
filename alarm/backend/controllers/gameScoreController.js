const GameScore = require('../models/GameScore');

const VALID_GAMES = ['TypingTest', 'MathDots', 'FlipGrid'];

// Get all scores for a specific game type
exports.getGameScores = async (req, res) => {
  try {
    const { gameType } = req.params;
    if (!VALID_GAMES.includes(gameType)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    const scores = await GameScore.find({ gameType })
      .sort({ score: -1 })
      .populate('userId', 'username email')
      .lean();

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving scores', error: error.message });
  }
};

// Get all scores across games
exports.getAllScores = async (req, res) => {
  try {
    const scores = await GameScore.find()
      .sort({ gameType: 1, score: -1 })
      .populate('userId', 'username email')
      .lean();

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving scores', error: error.message });
  }
};

// Get user's scores for a specific game
exports.getUserGameScores = async (req, res) => {
  try {
    const userId = req.userId;
    const { gameType } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!VALID_GAMES.includes(gameType)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    const scores = await GameScore.find({ userId, gameType })
      .sort({ createdAt: -1, score: -1 })
      .lean();

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user scores', error: error.message });
  }
};

// Get user's all game scores
exports.getUserAllScores = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const scores = await GameScore.find({ userId })
      .sort({ gameType: 1, createdAt: -1 })
      .lean();

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user scores', error: error.message });
  }
};

// Save a new game score
exports.saveGameScore = async (req, res) => {
  try {
    const userId = req.userId;
    const { gameType } = req.params;
    const { score, accuracy, timeSpent, difficulty, details } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!VALID_GAMES.includes(gameType)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    if (score === undefined || score === null) {
      return res.status(400).json({ message: 'Score is required' });
    }

    const newScore = new GameScore({
      gameType,
      score,
      accuracy: accuracy || 0,
      timeSpent: timeSpent || 0,
      difficulty: difficulty || 'normal',
      details: details || {},
      userId,
    });

    await newScore.save();

    res.status(201).json({
      message: 'Score saved successfully',
      score: newScore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving score', error: error.message });
  }
};

// Get leaderboard for a game type
exports.getLeaderboard = async (req, res) => {
  try {
    const { gameType } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    if (!VALID_GAMES.includes(gameType)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    const topScores = await GameScore.find({ gameType })
      .sort({ score: -1 })
      .limit(limit)
      .populate('userId', 'username email')
      .lean();

    res.status(200).json(topScores);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving leaderboard', error: error.message });
  }
};

// Get user's best score for a game type
exports.getUserBestScore = async (req, res) => {
  try {
    const userId = req.userId;
    const { gameType } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!VALID_GAMES.includes(gameType)) {
      return res.status(400).json({ message: 'Invalid game type' });
    }

    const bestScore = await GameScore.findOne({ userId, gameType })
      .sort({ score: -1 })
      .lean();

    if (!bestScore) {
      return res.status(404).json({ message: 'No scores found for this game' });
    }

    res.status(200).json(bestScore);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving best score', error: error.message });
  }
};

// Delete a specific score entry (user can only delete their own)
exports.deleteGameScore = async (req, res) => {
  try {
    const userId = req.userId;
    const { scoreId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const score = await GameScore.findOneAndDelete({ _id: scoreId, userId });

    if (!score) {
      return res.status(404).json({ message: 'Score not found' });
    }

    res.status(200).json({ message: 'Score deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting score', error: error.message });
  }
};
