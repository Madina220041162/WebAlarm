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
  const GRID_SIZE = 4;

  const symbols = ["🌟", "🎨", "🚀", "🎭", "🎪", "🎸", "🎲", "🎯"];

  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame(false);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (flipped.length === 2) {
      const timer = setTimeout(() => checkMatch(), 600);
      return () => clearTimeout(timer);
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0 && gameState === "playing") {
      endGame(true);
    }
  }, [matched, cards, gameState]);

  const initializeGame = () => {
    const pairs = [];
    for (let i = 0; i < (GRID_SIZE * GRID_SIZE) / 2; i++) {
      pairs.push(symbols[i % symbols.length], symbols[i % symbols.length]);
    }
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    
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
      setMatched((prev) => [...prev, first, second]);
      setScore((prev) => prev + 20);
    } else {
      setScore((prev) => Math.max(prev - 2, 0));
    }
    setFlipped([]);
    setMoves((prev) => prev + 1);
  };

  const handleCardClick = (index) => {
    if (
      gameState !== "playing" ||
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length >= 2
    ) return;
    setFlipped((prev) => [...prev, index]);
  };

  const endGame = (isWin) => {
    setGameState("finished");
    if (onGameEnd) {
      onGameEnd({
        score: score + (isWin ? timeLeft : 0),
        moves,
        matchedPairs: matched.length / 2,
        isVictory: isWin,
      });
    }
  };

  return (
    <div className="flip-grid-container">
      <div className="game-card">
        <div className="game-header">
          <span className="material-symbols-outlined icon-main">grid_view</span>
          <h2 className="high-vis-title">Flip Grid Mission</h2>
          <p className="game-description high-vis-text">
            Match all <strong>8 pairs</strong> to disarm.
          </p>
        </div>

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
            <span className="stat-value timer-alert">{timeLeft}s</span>
          </div>
        </div>

        {gameState === "playing" && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(matched.length / cards.length) * 100}%` }}
            ></div>
            <span className="progress-text">
              {matched.length / 2} / 8 Pairs Found
            </span>
          </div>
        )}

        {gameState === "idle" ? (
          <button onClick={initializeGame} className="btn-start">
            Initialize Grid
          </button>
        ) : (
          <div className="cards-grid">
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || matched.includes(index);
              return (
                <div
                  key={index}
                  className={`card ${isFlipped ? "flipped" : ""}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="card-inner">
                    <div className="card-front">?</div>
                    <div className="card-back">{card}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {gameState === "finished" && (
          <div className="game-over">
            <div className={`status-banner ${matched.length === cards.length ? "bg-success" : "bg-danger"}`}>
              {matched.length === cards.length ? "ALARM DISARMED" : "MISSION FAILED"}
            </div>
            
            <div className="final-stats">
              <p>Score: <strong>{score}</strong></p>
              <p>Moves: <strong>{moves}</strong></p>
            </div>

            {matched.length < cards.length ? (
              <button onClick={initializeGame} className="btn-replay">Retry Mission</button>
            ) : (
              <p className="success-msg">Neural pattern verified.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlipGrid;