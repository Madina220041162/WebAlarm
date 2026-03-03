import React, { useState, useEffect } from "react";
import { gameScoresAPI, getAuthToken } from "../services/api";
import TypingTest from "./TypingTest";
import MathDots from "./MathDots";
import FlipGrid from "./FlipGrid";

const GamesHub = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [scores, setScores] = useState({
    TypingTest: [],
    MathDots: [],
    FlipGrid: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gameLoading, setGameLoading] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [alarmDismissed, setAlarmDismissed] = useState(false);

  // Check for active ringing alarm
  useEffect(() => {
    const alarm = localStorage.getItem('activeRingingAlarm');
    if (alarm) {
      try {
        setActiveAlarm(JSON.parse(alarm));
      } catch (err) {
        console.error('Error parsing active alarm:', err);
      }
    }
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      setError("");
      const types = ["TypingTest", "MathDots", "FlipGrid"];
      const allScores = {};
      for (const type of types) {
        try {
          const data = await gameScoresAPI.getLeaderboard(type, 5);
          allScores[type] = Array.isArray(data) ? data : [];
        } catch (err) {
          console.warn(`Failed to fetch ${type} leaderboard:`, err);
          allScores[type] = [];
        }
      }
      setScores(allScores);
    } catch (error) {
      console.error("Error fetching scores:", error);
      setError("Failed to load leaderboards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleGameEnd = async (gameType, gameData) => {
    try {
      setGameLoading(true);
      setError("");

      if (!getAuthToken()) {
        setError("Please login to save your score");
        return;
      }

      const payload = {
        score: gameData.score,
        accuracy: gameData.accuracy || 0,
        timeSpent: gameData.timeSpent || 0,
        difficulty: gameData.difficulty || "normal",
        details: gameData,
      };

      await gameScoresAPI.save(gameType, payload);
      
      // Refresh scores after saving
      fetchScores();
      
      // If there was an active alarm, dismiss it
      if (activeAlarm) {
        localStorage.removeItem('activeRingingAlarm');
        setActiveAlarm(null);
        setAlarmDismissed(true);
        setError(`✅ ALARM DISABLED! You won the ${gameType} game! Well done!`);
        setTimeout(() => {
          setSelectedGame(null);
          setAlarmDismissed(false);
        }, 2000);
      } else {
        // Show success message and go back to hub after delay
        setTimeout(() => {
          setSelectedGame(null);
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving game score:", error);
      setError(error.message || "Failed to save your score");
    } finally {
      setGameLoading(false);
    }
  };

  if (selectedGame === "typing") {
    return (
      <div>
        <button
          onClick={() => !activeAlarm && setSelectedGame(null)}
          className="btn-back-to-hub"
          disabled={activeAlarm && !alarmDismissed}
          style={activeAlarm && !alarmDismissed ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          title={activeAlarm && !alarmDismissed ? 'Win the game to go back' : ''}
        >
          ← Back to Games Hub
        </button>
        {activeAlarm && !alarmDismissed && (
          <div className="alarm-requirement">
            🔔 ALARM ACTIVE: You must win this game to stop the alarm!
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        {gameLoading && <div className="game-saving">💾 Saving your score...</div>}
        <TypingTest
          onGameEnd={(data) => handleGameEnd("TypingTest", data)}
        />
      </div>
    );
  }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={() => !activeAlarm && setSelectedGame(null)}
          className="btn-back-to-hub"
          disabled={activeAlarm && !alarmDismissed}
          style={activeAlarm && !alarmDismissed ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          title={activeAlarm && !alarmDismissed ? 'Win the game to go back' : ''}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Hub
        </button>
        {activeAlarm && !alarmDismissed && (
          <div className="alarm-requirement">
            🔔 ALARM ACTIVE: You must win this game to stop the alarm!
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        {gameLoading && <div className="game-saving">💾 Saving your score...</div>}
        <MathDots onGameEnd={(data) => handleGameEnd("MathDots", data)} />
      </div>
    );
  }

  if (selectedGame === "flip") {
    return (
      <div>
        <button
          onClick={() => !activeAlarm && setSelectedGame(null)}
          className="btn-back-to-hub"
          disabled={activeAlarm && !alarmDismissed}
          style={activeAlarm && !alarmDismissed ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          title={activeAlarm && !alarmDismissed ? 'Win the game to go back' : ''}
        >
          ← Back to Games Hub
        </button>
        {activeAlarm && !alarmDismissed && (
          <div className="alarm-requirement">
            🔔 ALARM ACTIVE: You must win this game to stop the alarm!
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        {gameLoading && <div className="game-saving">💾 Saving your score...</div>}
        <FlipGrid onGameEnd={(data) => handleGameEnd("FlipGrid", data)} />
      </div>
    );
  }

  return (
    <div className="games-hub-container">
      <h2>🎮 Games Hub</h2>
      
      {activeAlarm && !alarmDismissed && (
        <div className="alarm-requirement">
          🔔 ALARM ACTIVE: Choose a game and win to disable it!
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}

      <div className="games-grid">
        <div
          className="game-option"
          onClick={() => setSelectedGame("typing")}
          role="button"
          tabIndex={0}
        >
          <h3>⌨️ Typing Test</h3>
          <p>Type fast and accurate. No backspacing allowed!</p>
          <div className="high-score">
            {scores.TypingTest.length > 0 ? (
              <span>🏆 {scores.TypingTest[0].score}</span>
            ) : (
              <span>Play to set a score</span>
            )}
          </div>
          <button onClick={() => setSelectedGame("typing")} className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all">
            Initialize Battle
          </button>
        </div>

        <div
          className="game-option"
          onClick={() => setSelectedGame("math")}
          role="button"
          tabIndex={0}
        >
          <h3>🎯 Math Dots</h3>
          <p>Watch and repeat the pattern of dots!</p>
          <div className="high-score">
            {scores.MathDots.length > 0 ? (
              <span>🏆 {scores.MathDots[0].score}</span>
            ) : (
              <span>Play to set a score</span>
            )}
          </div>
          <h3 className="text-xl font-extrabold mb-3 text-slate-800">Math Dots</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">Solve rapid-fire equations to silence the digital beast.</p>
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-1">Personal Best</span>
            <span className="text-2xl font-black text-accent">{scores.mathDots[0]?.score || 0}</span>
          </div>
          <button onClick={() => setSelectedGame("math")} className="w-full py-4 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-accent/30 hover:shadow-accent/40 transition-all">
            Start Logic Test
          </button>
        </div>

        <div
          className="game-option"
          onClick={() => setSelectedGame("flip")}
          role="button"
          tabIndex={0}
        >
          <h3>🎴 Flip Grid</h3>
          <p>Match pairs of symbols before time runs out!</p>
          <div className="high-score">
            {scores.FlipGrid.length > 0 ? (
              <span>🏆 {scores.FlipGrid[0].score}</span>
            ) : (
              <span>Play to set a score</span>
            )}
          </div>
          <button onClick={() => setSelectedGame("flip")} className="w-full py-4 bg-secondary text-white rounded-2xl font-bold shadow-lg shadow-secondary/30 hover:shadow-secondary/40 transition-all">
            Enter Pattern Zone
          </button>
        </div>
      </div>

      {/* Leaderboards */}
      {loading ? (
        <div className="loading">Loading leaderboards...</div>
      ) : (
        <div className="leaderboards">
          <div className="leaderboard">
            <h4>⌨️ Typing Test Top 5</h4>
            {scores.TypingTest.length === 0 ? (
              <p className="no-scores">No scores yet</p>
            ) : (
              <ol>
                {scores.TypingTest.map((score, idx) => (
                  <li key={idx}>
                    <span className="player-name">
                      {score.userId?.username || "Anonymous"}
                    </span>
                    <span className="score-value">{score.score}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="leaderboard">
            <h4>🎯 Math Dots Top 5</h4>
            {scores.MathDots.length === 0 ? (
              <p className="no-scores">No scores yet</p>
            ) : (
              <ol>
                {scores.MathDots.map((score, idx) => (
                  <li key={idx}>
                    <span className="player-name">
                      {score.userId?.username || "Anonymous"}
                    </span>
                    <span className="score-value">{score.score}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="leaderboard">
            <h4>🎴 Flip Grid Top 5</h4>
            {scores.FlipGrid.length === 0 ? (
              <p className="no-scores">No scores yet</p>
            ) : (
              <ol>
                {scores.FlipGrid.map((score, idx) => (
                  <li key={idx}>
                    <span className="player-name">
                      {score.userId?.username || "Anonymous"}
                    </span>
                    <span className="score-value">{score.score}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesHub;
