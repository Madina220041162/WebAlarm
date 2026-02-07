const express = require("express");
const gameScoreController = require("../controllers/gameScoreController");

const router = express.Router();

// Return all game scores (compatibility endpoint)
router.get("/", gameScoreController.getAllScores);

// Routes by game type
router.get("/:gameType", gameScoreController.getGameScores);
router.post("/:gameType", gameScoreController.saveGameScore);
router.get("/:gameType/high", gameScoreController.getHighScores);

module.exports = router;
