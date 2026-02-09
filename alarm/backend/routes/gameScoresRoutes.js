const express = require("express");
const gameScoreController = require("../controllers/gameScoreController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes - must come BEFORE generic /:gameType routes
router.get("/user/all", authMiddleware, gameScoreController.getUserAllScores);
router.get("/user/:gameType/best", authMiddleware, gameScoreController.getUserBestScore);
router.get("/user/:gameType", authMiddleware, gameScoreController.getUserGameScores);
router.post("/:gameType", authMiddleware, gameScoreController.saveGameScore);

// Public routes - get global leaderboards and scores
router.get("/", gameScoreController.getAllScores);
router.get("/:gameType/leaderboard", gameScoreController.getLeaderboard);
router.get("/:gameType", gameScoreController.getGameScores);

// Delete route (protected)
router.delete("/:scoreId", authMiddleware, gameScoreController.deleteGameScore);

module.exports = router;
