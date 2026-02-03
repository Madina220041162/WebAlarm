import GameScore from '../models/GameScore.js'

// Get scores for user
export const getScores = async (req, res) => {
  try {
    const scores = await GameScore.find({ userId: req.userId })
    res.json({ scores })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Submit game score
export const submitScore = async (req, res) => {
  try {
    const { gameId, score } = req.body

    const gameScore = new GameScore({
      userId: req.userId,
      gameId,
      score
    })

    await gameScore.save()
    res.status(201).json({ message: 'Score submitted', gameScore })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await GameScore.aggregate([
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 }
    ])

    res.json({ leaderboard })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}