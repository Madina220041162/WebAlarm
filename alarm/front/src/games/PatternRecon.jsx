import React, { useState, useEffect } from "react";
import "./PatternRecon.css";

const PatternRecon = ({ onGameEnd }) => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [gameState, setGameState] = useState("idle"); // idle, playing, finished
  const [level, setLevel] = useState(1);

  const colors = ["red", "blue", "green", "yellow"];
  const WIN_LEVEL = 5; // User must complete 5 rounds to disarm

  const startLevel = (currentLevel) => {
    const newSequence = [];
    for (let i = 0; i < currentLevel + 2; i++) {
      newSequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    setSequence(newSequence);
    setUserSequence([]);
    showSequence(newSequence);
  };

  const showSequence = async (seq) => {
    setIsDisplaying(true);
    setGameState("playing");
    for (let color of seq) {
      setActiveColor(color);
      await new Promise((r) => setTimeout(r, 600));
      setActiveColor(null);
      await new Promise((r) => setTimeout(r, 200));
    }
    setIsDisplaying(false);
  };

  const handleColorClick = (color) => {
    if (isDisplaying || gameState !== "playing") return;

    const newUserSeq = [...userSequence, color];
    setUserSequence(newUserSeq);

    // Check if wrong
    if (color !== sequence[userSequence.length]) {
      endGame(false);
      return;
    }

    // Check if round complete
    if (newUserSeq.length === sequence.length) {
      if (level >= WIN_LEVEL) {
        endGame(true);
      } else {
        setTimeout(() => {
          setLevel(level + 1);
          startLevel(level + 1);
        }, 1000);
      }
    }
  };

  const endGame = (isWin) => {
    setGameState("finished");
    if (onGameEnd) {
      onGameEnd({
        isVictory: isWin,
        levelReached: level,
      });
    }
  };

  return (
    <div className="pattern-recon-container">
      <div className="game-card">
        <div className="game-header">
          <h2 className="high-vis-title">Pattern Recon</h2>
          <p className="game-description">Level {level} of {WIN_LEVEL}: Repeat the neural flash.</p>
        </div>

        {gameState === "idle" ? (
          <button onClick={() => startLevel(1)} className="btn-start">Start Mission</button>
        ) : (
          <div className="pattern-grid">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-pad ${color} ${activeColor === color ? "active" : ""} ${isDisplaying ? "disabled" : ""}`}
                onClick={() => handleColorClick(color)}
              />
            ))}
          </div>
        )}

        {gameState === "finished" && (
          <div className="game-over">
             <h3 className={level >= WIN_LEVEL ? "text-success" : "text-danger"}>
               {level >= WIN_LEVEL ? "SYSTEM FAILED" : "NEURAL OVERLOAD"}
             </h3>
             <button onClick={() => {setLevel(1); startLevel(1);}} className="btn-replay">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternRecon;