import React, { useState, useEffect, useRef } from "react";
import "./MathDots.css";

const MathDots = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState("idle"); // idle, playing, finished
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeDot, setActiveDot] = useState(null);
  const [canClick, setCanClick] = useState(false);

  const gridSize = 3;
  const WIN_LEVEL = 4; // Level required to disarm the alarm
  const timerRef = useRef(null);

  // Countdown timer logic
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame(false);
    }

    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setPattern([]);
    setUserPattern([]);
    setScore(0);
    setLevel(0);
    setTimeLeft(45); // Giving a bit more time for memory patterns
    setGameState("playing");
    // Start the first pattern sequence
    setTimeout(() => nextLevel([]), 500);
  };

  const endGame = (isWin) => {
    setGameState("finished");
    setCanClick(false);
    clearInterval(timerRef.current);

    if (onGameEnd) {
      onGameEnd({
        score: score,
        level: level,
        isVictory: isWin, // Critical for the alarm disarm logic
        details: `Reached Level ${level}`,
      });
    }
  };

  const nextLevel = (currentPattern) => {
    const newDot = Math.floor(Math.random() * (gridSize * gridSize));
    const nextPattern = [...currentPattern, newDot];
    setPattern(nextPattern);
    setUserPattern([]);
    setLevel(nextPattern.length);
    playPatternSequence(nextPattern);
  };

  const playPatternSequence = async (sequence) => {
    setCanClick(false);
    for (const dotId of sequence) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      flashDot(dotId);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    setCanClick(true);
  };

  const flashDot = (dotId) => {
    setActiveDot(dotId);
    setTimeout(() => setActiveDot(null), 300);
  };

  const handleDotClick = (dotId) => {
    if (!canClick || gameState !== "playing") return;

    flashDot(dotId);
    const newUserPattern = [...userPattern, dotId];
    setUserPattern(newUserPattern);

    // Check if the most recent click is correct
    const currentIndex = newUserPattern.length - 1;
    if (newUserPattern[currentIndex] !== pattern[currentIndex]) {
      // Wrong move
      setScore((prev) => Math.max(0, prev - 10));
      endGame(false);
      return;
    }

    // Check if the whole pattern is finished
    if (newUserPattern.length === pattern.length) {
      setScore((prev) => prev + (10 * level));
      
      // WIN CONDITION CHECK
      if (level >= WIN_LEVEL) {
        endGame(true);
      } else {
        setCanClick(false);
        setTimeout(() => nextLevel(pattern), 1000);
      }
    }
  };

  return (
    <div className="math-dots-container">
      <div className="game-card">
        <div className="game-header">
          <span className="material-symbols-outlined icon-main">psychology</span>
          <h2>Pattern Mission</h2>
          <p className="game-description">
            Reach <strong>Level {WIN_LEVEL}</strong> to silence the alarm.
          </p>
        </div>

        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value highlight">{level}/{WIN_LEVEL}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
        </div>

        {gameState === "idle" ? (
          <button onClick={startGame} className="btn-start">
            Begin Sequence
          </button>
        ) : (
          <div className="dots-grid">
            {Array.from({ length: gridSize * gridSize }).map((_, index) => (
              <button
                key={index}
                disabled={!canClick || gameState === "finished"}
                className={`dot ${activeDot === index ? "active" : ""} ${!canClick ? "sequence-playing" : ""}`}
                onClick={() => handleDotClick(index)}
              >
                <div className="dot-inner"></div>
              </button>
            ))}
          </div>
        )}

        {gameState === "playing" && (
          <div className="level-info">
            <p className={canClick ? "text-primary animate-pulse" : "text-slate-400"}>
              {canClick ? "Your Turn: Repeat Pattern" : "Watch Closely..."}
            </p>
          </div>
        )}

        {gameState === "finished" && (
          <div className="game-over animate-in zoom-in duration-300">
            <div className={`status-banner ${level >= WIN_LEVEL ? "bg-success" : "bg-danger"}`}>
              {level >= WIN_LEVEL ? "ALARM DISARMED" : "MISSION FAILED"}
            </div>
            
            <div className="final-stats">
              <p>Final Level: <strong>{level}</strong></p>
              <p>Final Score: <strong>{score}</strong></p>
            </div>

            {level < WIN_LEVEL ? (
              <button onClick={startGame} className="btn-replay">
                Try Again
              </button>
            ) : (
              <p className="success-text">Verification Complete. You may now dismiss the alarm.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathDots;