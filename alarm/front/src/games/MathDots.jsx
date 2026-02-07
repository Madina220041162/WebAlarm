import React, { useState, useEffect } from "react";
import "./MathDots.css";

const MathDots = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState("idle"); // idle, playing, finished
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeDot, setActiveDot] = useState(null);
  const [canClick, setCanClick] = useState(false);

  const gridSize = 3; // 3x3 grid

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "playing" && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setPattern([]);
    setUserPattern([]);
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
    setCanClick(true);
    setGameState("playing");
  };

  const endGame = () => {
    setGameState("finished");
    setCanClick(false);
    if (onGameEnd) {
      onGameEnd({
        score,
        level,
        pattern: pattern.length,
      });
    }
  };

  const generateRandomDot = () => {
    return Math.floor(Math.random() * (gridSize * gridSize));
  };

  const playPattern = async () => {
    setCanClick(false);
    const newPattern = [...pattern, generateRandomDot()];
    setPattern(newPattern);
    setUserPattern([]);
    setLevel(newPattern.length);

    // Play the pattern
    for (let i = 0; i < newPattern.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      playDot(newPattern[i]);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    setCanClick(true);
  };

  const playDot = (dotId) => {
    setActiveDot(dotId);
    setTimeout(() => setActiveDot(null), 200);
  };

  const handleDotClick = (dotId) => {
    if (!canClick || gameState !== "playing") return;

    playDot(dotId);
    const newUserPattern = [...userPattern, dotId];
    setUserPattern(newUserPattern);

    // Check if user's pattern matches
    if (newUserPattern[newUserPattern.length - 1] !== pattern[newUserPattern.length - 1]) {
      // Wrong! Game over
      setScore(score - 5);
      setCanClick(false);
      endGame();
      return;
    }

    // If user completed the pattern, show next level
    if (newUserPattern.length === pattern.length) {
      setScore(score + 10 * level);
      setCanClick(false);
      setTimeout(playPattern, 1000);
    }
  };

  const handleStartOrNext = () => {
    if (gameState === "idle") {
      startGame();
      setTimeout(() => playPattern(), 500);
    } else if (gameState === "playing" && userPattern.length === 0 && pattern.length === 0) {
      setTimeout(() => playPattern(), 500);
    }
  };

  return (
    <div className="math-dots-container">
      <div className="game-card">
        <h2>🎯 Math Dots Pattern</h2>
        <p className="game-description">
          Watch the pattern and repeat it by clicking the dots!
        </p>

        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
        </div>

        {gameState === "idle" && (
          <button onClick={handleStartOrNext} className="btn-start">
            Start Game
          </button>
        )}

        <div className="dots-grid">
          {Array.from({ length: gridSize * gridSize }).map((_, index) => (
            <div
              key={index}
              className={`dot ${activeDot === index ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        {gameState === "playing" && pattern.length > 0 && (
          <div className="level-info">
            <p>Repeat the pattern! ({userPattern.length}/{pattern.length})</p>
          </div>
        )}

        {gameState === "finished" && (
          <div className="game-over">
            <h3>Game Over!</h3>
            <div className="final-stats">
              <p>
                <strong>Final Score:</strong> {score}
              </p>
              <p>
                <strong>Level Reached:</strong> {level}
              </p>
              <p>
                <strong>Pattern Length:</strong> {pattern.length}
              </p>
            </div>
            <button onClick={startGame} className="btn-replay">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathDots;
