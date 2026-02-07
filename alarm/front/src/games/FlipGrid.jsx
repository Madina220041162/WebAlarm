import React, { useState, useEffect } from "react";
import "./FlipGrid.css";

const FlipGrid = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState("idle");
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const GRID_SIZE = 4; // 4x4 grid = 16 cards

  const symbols = ["🌟", "🎨", "🚀", "🎭", "🎪", "🎸", "🎲", "🎯"];

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "playing" && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (flipped.length === 2) {
      checkMatch();
    }
  }, [flipped]);

  const initializeGame = () => {
    const pairs = [];
    for (let i = 0; i < (GRID_SIZE * GRID_SIZE) / 2; i++) {
      pairs.push(symbols[i % symbols.length], symbols[i % symbols.length]);
    }
    // Shuffle array
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScore(0);
    setTimeLeft(60);
    setGameState("playing");
  };

  const checkMatch = () => {
    const [first, second] = flipped;
    if (cards[first] === cards[second]) {
      setMatched([...matched, first, second]);
      setScore(score + 10);
      setFlipped([]);
    } else {
      setScore(Math.max(score - 1, 0));
      setTimeout(() => setFlipped([]), 600);
    }
    setMoves(moves + 1);
  };

  const handleCardClick = (index) => {
    if (
      gameState !== "playing" ||
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length === 2
    ) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const endGame = () => {
    setGameState("finished");
    if (onGameEnd) {
      onGameEnd({
        score,
        moves,
        matchedPairs: matched.length / 2,
      });
    }
  };

  if (cards.length === 0 && gameState === "idle") {
    return (
      <div className="flip-grid-container">
        <div className="game-card">
          <h2>🎴 Flip Grid Memory</h2>
          <p className="game-description">
            Match pairs of symbols before time runs out!
          </p>
          <button onClick={initializeGame} className="btn-start">
            Start Game (60s)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flip-grid-container">
      <div className="game-card">
        <h2>🎴 Flip Grid Memory</h2>

        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
        </div>

        {gameState === "playing" && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(matched.length / cards.length) * 100}%` }}
            ></div>
            <span className="progress-text">
              {matched.length / 2}/{cards.length / 2} Pairs
            </span>
          </div>
        )}

        <div className="cards-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card ${
                flipped.includes(index) || matched.includes(index) ? "flipped" : ""
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">{card}</div>
              </div>
            </div>
          ))}
        </div>

        {gameState === "finished" && (
          <div className="game-over">
            <h3>Game Over!</h3>
            <div className="final-stats">
              <p>
                <strong>Final Score:</strong> {score}
              </p>
              <p>
                <strong>Total Moves:</strong> {moves}
              </p>
              <p>
                <strong>Pairs Matched:</strong> {matched.length / 2}/{cards.length / 2}
              </p>
            </div>
            <button onClick={initializeGame} className="btn-replay">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlipGrid;
