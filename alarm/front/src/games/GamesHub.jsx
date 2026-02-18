import React, { useState, useEffect } from "react";
import TypingTest from "./TypingTest";
import MathDots from "./MathDots";
import FlipGrid from "./FlipGrid";
import "./GamesHub.css";

const GamesHub = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [scores, setScores] = useState({
    typingTest: [],
    mathDots: [],
    flipGrid: [],
  });

  const API_URL = import.meta.env.VITE_API_URL + "/api/game-scores";

  const fetchScores = async () => {
    try {
      const types = ["typingTest", "mathDots", "flipGrid"];
      const allScores = {};

      for (const type of types) {
        const response = await fetch(`${API_URL}/${type}?limit=5`);
        if (response.ok) {
          allScores[type] = await response.json();
        }
      }
      setScores(allScores);
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleGameEnd = async (gameType, gameData) => {
    try {
      const response = await fetch(`${API_URL}/${gameType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: "Player",
          score: gameData.score,
          details: gameData,
        }),
      });

      if (response.ok) {
        fetchScores();
      }
    } catch (error) {
      console.error("Error saving game score:", error);
    }
  };

  if (selectedGame === "typing") {
    return (
      <div>
        <button
          onClick={() => setSelectedGame(null)}
          className="btn-back-to-hub"
        >
          ← Back to Games Hub
        </button>
        <TypingTest
          onGameEnd={(data) => handleGameEnd("typingTest", data)}
        />
      </div>
    );
  }

  if (selectedGame === "math") {
    return (
      <div>
        <button
          onClick={() => setSelectedGame(null)}
          className="btn-back-to-hub"
        >
          ← Back to Games Hub
        </button>
        <MathDots onGameEnd={(data) => handleGameEnd("mathDots", data)} />
      </div>
    );
  }

  if (selectedGame === "flip") {
    return (
      <div>
        <button
          onClick={() => setSelectedGame(null)}
          className="btn-back-to-hub"
        >
          ← Back to Games Hub
        </button>
        <FlipGrid onGameEnd={(data) => handleGameEnd("flipGrid", data)} />
      </div>
    );
  }

  return (
    <div className="games-hub-container">
      <h2>🎮 Games Hub</h2>
      <div className="games-grid">
        <div className="game-option" onClick={() => setSelectedGame("typing")}>
          <h3>⌨️ Typing Test</h3>
          <p>Type fast and accurate. No backspacing allowed!</p>
          <div className="high-score">
            {scores.typingTest.length > 0 && (
              <span>🏆 {scores.typingTest[0].score}</span>
            )}
          </div>
        </div>

        <div className="game-option" onClick={() => setSelectedGame("math")}>
          <h3>🎯 Math Dots</h3>
          <p>Watch and repeat the pattern of dots!</p>
          <div className="high-score">
            {scores.mathDots.length > 0 && (
              <span>🏆 {scores.mathDots[0].score}</span>
            )}
          </div>
        </div>

        <div className="game-option" onClick={() => setSelectedGame("flip")}>
          <h3>🎴 Flip Grid</h3>
          <p>Match pairs of symbols before time runs out!</p>
          <div className="high-score">
            {scores.flipGrid.length > 0 && (
              <span>🏆 {scores.flipGrid[0].score}</span>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div className="leaderboards">
        <div className="leaderboard">
          <h4>⌨️ Typing Test Top Scores</h4>
          {scores.typingTest.length === 0 ? (
            <p>No scores yet</p>
          ) : (
            <ol>
              {scores.typingTest.map((score, idx) => (
                <li key={idx}>
                  {score.playerName}: <strong>{score.score}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="leaderboard">
          <h4>🎯 Math Dots Top Scores</h4>
          {scores.mathDots.length === 0 ? (
            <p>No scores yet</p>
          ) : (
            <ol>
              {scores.mathDots.map((score, idx) => (
                <li key={idx}>
                  {score.playerName}: <strong>{score.score}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="leaderboard">
          <h4>🎴 Flip Grid Top Scores</h4>
          {scores.flipGrid.length === 0 ? (
            <p>No scores yet</p>
          ) : (
            <ol>
              {scores.flipGrid.map((score, idx) => (
                <li key={idx}>
                  {score.playerName}: <strong>{score.score}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesHub;
