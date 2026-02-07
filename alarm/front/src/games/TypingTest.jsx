import React, { useState, useEffect, useRef } from "react";
import "./TypingTest.css";

const TypingTest = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState("idle"); // idle, playing, finished
  const [text, setText] = useState("");
  const [targetText, setTargetText] = useState("The quick brown fox jumps over the lazy dog");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const inputRef = useRef(null);

  const texts = [
    "The quick brown fox jumps over the lazy dog",
    "Pack my box with five dozen liquor jugs",
    "How vexingly quick daft zebras jump",
    "The five boxing wizards jump quickly",
    "Sphinx of black quartz judge my vow",
  ];

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "playing" && timeLeft === 0) {
      endGame();
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setText("");
    setMistakes(0);
    setScore(0);
    setTimeLeft(60);
    setTargetText(texts[Math.floor(Math.random() * texts.length)]);
    setGameState("playing");
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const endGame = () => {
    setGameState("finished");
    if (onGameEnd) {
      onGameEnd({
        score,
        mistakes,
        wordsPerMinute: Math.floor((text.length / 5) / ((60 - timeLeft) / 60)),
      });
    }
  };

  const handleInput = (e) => {
    const input = e.target.value;
    
    // Prevent backspace
    if (input.length < text.length) {
      // User tried to delete - don't allow it
      e.target.value = text;
      setMistakes(mistakes + 1);
      return;
    }

    setText(input);

    // Check if the typed character matches
    const lastIndex = input.length - 1;
    if (input[lastIndex] !== targetText[lastIndex]) {
      setMistakes(mistakes + 1);
    } else {
      setScore(score + 1);
    }

    // Check if completed
    if (input === targetText) {
      setScore(score + 10); // Bonus for completing the phrase
      setText("");
      setTargetText(texts[Math.floor(Math.random() * texts.length)]);
    }
  };

  return (
    <div className="typing-test-container">
      <div className="game-card">
        <h2>⌨️ Typing Test</h2>
        <p className="game-description">
          Type as fast and accurate as possible. No backspacing allowed!
        </p>

        {gameState === "idle" && (
          <button onClick={startGame} className="btn-start">
            Start Game (60s)
          </button>
        )}

        {(gameState === "playing" || gameState === "finished") && (
          <>
            <div className="game-stats">
              <div className="stat">
                <span className="stat-label">Score</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Mistakes</span>
                <span className="stat-value mistakes">{mistakes}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Time Left</span>
                <span className="stat-value">{timeLeft}s</span>
              </div>
            </div>

            <div className="target-text">{targetText}</div>

            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={handleInput}
              placeholder="Start typing here..."
              className="typing-input"
              disabled={gameState === "finished"}
              autoFocus
            />

            <div className="typed-feedback">
              {text.split("").map((char, i) => (
                <span
                  key={i}
                  className={char === targetText[i] ? "correct" : "incorrect"}
                >
                  {char}
                </span>
              ))}
            </div>
          </>
        )}

        {gameState === "finished" && (
          <div className="game-over">
            <h3>Game Over!</h3>
            <div className="final-stats">
              <p>
                <strong>Final Score:</strong> {score}
              </p>
              <p>
                <strong>Total Mistakes:</strong> {mistakes}
              </p>
              <p>
                <strong>Words Per Minute:</strong>{" "}
                {Math.floor((text.length / 5) / 1)}
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

export default TypingTest;
