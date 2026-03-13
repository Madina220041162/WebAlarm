import React, { useState, useEffect, useRef } from "react";
import "./TypingTest.css";

const TypingTest = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState("idle"); // idle, playing, finished
  const [text, setText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [phrasesCompleted, setPhrasesCompleted] = useState(0);
  const inputRef = useRef(null);

  const REQUIRED_PHRASES = 3; 

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
    setPhrasesCompleted(0);
    setTargetText(texts[Math.floor(Math.random() * texts.length)]);
    setGameState("playing");
    
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const endGame = () => {
    setGameState("finished");
    if (onGameEnd) {
      onGameEnd({
        score: score,
        mistakes: mistakes,
        phrasesCompleted: phrasesCompleted,
        isVictory: phrasesCompleted >= REQUIRED_PHRASES, 
        wordsPerMinute: Math.floor((text.length / 5) / ((60 - timeLeft) / 60)) || 0,
      });
    }
  };

  const handleInput = (e) => {
    if (gameState !== "playing") return;
    
    const input = e.target.value;
    
    // Anti-Cheat: Prevent Backspace
    if (input.length < text.length) {
      setMistakes(prev => prev + 1);
      return; 
    }

    setText(input);

    const lastIndex = input.length - 1;
    if (input[lastIndex] !== targetText[lastIndex]) {
      setMistakes(prev => prev + 1);
    } else {
      setScore(prev => prev + 1);
    }

    if (input === targetText) {
      const newCount = phrasesCompleted + 1;
      setPhrasesCompleted(newCount);
      setScore(prev => prev + 50);

      if (newCount >= REQUIRED_PHRASES) {
        endGame();
      } else {
        setText("");
        setTargetText(texts[Math.floor(Math.random() * texts.length)]);
      }
    }
  };

  return (
    <div className="typing-test-container">
      <div className="game-card">
        <div className="game-header">
          <span className="material-symbols-outlined icon-main">keyboard</span>
          <h2 className="high-vis-title">Typing Mission</h2>
          <p className="game-description high-vis-text">
            Complete <strong>{REQUIRED_PHRASES} phrases</strong> to disarm the alarm.
            <br />
            <span className="warning-text">BACKSPACE IS DISABLED!</span>
          </p>
        </div>

        {gameState === "idle" && (
          <button onClick={startGame} className="btn-start">
            START TYPING BATTLE
          </button>
        )}

        {(gameState === "playing" || gameState === "finished") && (
          <>
            <div className="game-stats">
              <div className="stat">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{phrasesCompleted}/{REQUIRED_PHRASES}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Mistakes</span>
                <span className="stat-value mistakes">{mistakes}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Time Left</span>
                <span className="stat-value timer-alert">{timeLeft}s</span>
              </div>
            </div>

            <div className="target-area">
              <div className="target-text high-vis-target">
                {targetText.split("").map((char, i) => {
                  let colorClass = "char-future";
                  if (i < text.length) {
                    colorClass = text[i] === targetText[i] ? "char-correct" : "char-wrong";
                  }
                  return <span key={i} className={colorClass}>{char}</span>;
                })}
              </div>

              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={handleInput}
                placeholder="Type here..."
                className="typing-input high-vis-input"
                disabled={gameState === "finished"}
                autoFocus
                autoComplete="off"
                onPaste={(e) => e.preventDefault()}
              />
            </div>
          </>
        )}

        {gameState === "finished" && (
          <div className="game-over">
            <div className={`status-banner ${phrasesCompleted >= REQUIRED_PHRASES ? "bg-success" : "bg-danger"}`}>
              {phrasesCompleted >= REQUIRED_PHRASES ? "MISSION ACCOMPLISHED" : "MISSION FAILED"}
            </div>
            
            <div className="final-stats">
              <div className="final-stat-item">
                <label>Final Score</label>
                <span className="high-vis-value">{score}</span>
              </div>
              <div className="final-stat-item">
                <label>Accuracy</label>
                <span className="high-vis-value">{Math.max(0, 100 - mistakes)}%</span>
              </div>
            </div>

            {phrasesCompleted >= REQUIRED_PHRASES ? (
              <p className="success-msg">The alarm lock has been released.</p>
            ) : (
              <button onClick={startGame} className="btn-replay">
                RETRY MISSION
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTest;