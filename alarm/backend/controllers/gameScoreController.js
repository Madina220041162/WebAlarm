  const GameScore = require('../models/GameScore');

const VALID_GAMES = ['typingTest', 'mathDots', 'flipGrid'];

exports.getGameScores = async (req, res) => {
  try {
    const { gameType } = req.params;
    if (!VALID_GAMES.includes(gameType)) return res.status(400).json({ message: 'Invalid game type' });

    const scores = await GameScore.find({ gameType }).sort({ score: -1 }).lean();
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving scores', error: error.message });
  }
};

// Return all scores across games (used for compatibility GET /api/gamescores)
exports.getAllScores = async (req, res) => {
  try {
    const scores = await GameScore.find().sort({ gameType: 1, score: -1 }).lean();
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving scores', error: error.message });
  }
};

exports.saveGameScore = async (req, res) => {
  try {
    const { gameType } = req.params;
    const { playerName, score, details } = req.body;
    if (!VALID_GAMES.includes(gameType)) return res.status(400).json({ message: 'Invalid game type' });
    if (!playerName || score === undefined) return res.status(400).json({ message: 'Player name and score are required' });

    const newScore = new GameScore({
      gameType,
      playerName,
      score,
      details: details || {},
      userId: req.userId || undefined,
    });

    await newScore.save();

    // Optionally prune old scores: keep top 50
    const allScores = await GameScore.find({ gameType }).sort({ score: -1 }).lean();
    if (allScores.length > 50) {
      const toRemove = allScores.slice(50).map((s) => s._id);
      await GameScore.deleteMany({ _id: { $in: toRemove } });
    }

    res.status(201).json({ message: 'Score saved', score: newScore });
  } catch (error) {
    res.status(500).json({ message: 'Error saving score', error: error.message });
  }
};

exports.getHighScores = async (req, res) => {
  try {
    const { gameType } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    if (!VALID_GAMES.includes(gameType)) return res.status(400).json({ message: 'Invalid game type' });

    const topScores = await GameScore.find({ gameType }).sort({ score: -1 }).limit(limit).lean();
    res.status(200).json(topScores);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving high scores', error: error.message });
  }
};
