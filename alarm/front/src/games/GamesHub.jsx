import React, { useState, useEffect } from "react";
import TypingTest from "./TypingTest";
import MathDots from "./MathDots";
import FlipGrid from "./FlipGrid";
import PatternRecon from "./PatternRecon";

const GamesHub = ({ onGameWin }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [scores, setScores] = useState({
    typingTest: [],
    mathDots: [],
    flipGrid: [],
    patternRecon: [],
  });

  const API_URL = import.meta.env.VITE_API_URL + "/api/game-scores";

  // 1. Fetch Leaderboards (Optional visual flair for the Hub)
  const fetchScores = async () => {
    try {
      const types = ["typingTest", "mathDots", "flipGrid", "patternRecon"];
      const allScores = {};
      for (const type of types) {
        const response = await fetch(`${API_URL}/${type}?limit=3`);
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

  /**
   * Handle the end of a game mission.
   * This is triggered by the individual game components.
   */
  const handleGameEnd = async (gameType, gameData) => {
    // A. Save to Database (Non-blocking)
    try {
      await fetch(`${API_URL}/${gameType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: "Agent",
          score: gameData.score || gameData.levelReached || 0,
          details: gameData,
        }),
      });
      fetchScores();
    } catch (error) {
      console.error("Error saving score:", error);
    }

    // B. Mission Verification Logic
    // If gameData.isVictory is true, we authorize the alarm shutdown
    if (gameData.isVictory) {
      console.log("Mission Accomplished! Authorizing alarm shutdown...");
      
      // 1. Trigger the parent callback to update the global 'proofVerified' state
      if (onGameWin) onGameWin();

      // 2. Persist result to LocalStorage for page refreshes
      const challengeStr = localStorage.getItem("active-proof-challenge");
      const challenge = challengeStr ? JSON.parse(challengeStr) : null;

      const verification = {
        passed: true,
        alarmId: challenge?.alarmId || "manual_trigger",
        target: "game",
        verifiedAt: Date.now(),
      };

      localStorage.setItem("proof-verification-result", JSON.stringify(verification));
      
      // 3. Dispatch global event for listeners (like CalendarPage)
      window.dispatchEvent(new Event("proof-verification-updated"));
      
      // 4. Return to the hub view
      setSelectedGame(null);
    } else {
      console.log("Mission Failed. The alarm continues...");
    }
  };

  // --- RENDER GAME VIEW ---
  if (selectedGame) {
    const gameMap = {
      typing: { comp: TypingTest, type: "typingTest" },
      math: { comp: MathDots, type: "mathDots" },
      flip: { comp: FlipGrid, type: "flipGrid" },
      pattern: { comp: PatternRecon, type: "patternRecon" },
    };

    const { comp: GameComp, type: gType } = gameMap[selectedGame];

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => setSelectedGame(null)}
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-2xl font-bold text-slate-600 shadow-sm hover:bg-slate-900 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
            Abort Mission
          </button>

          <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-2xl border-4 border-slate-100 min-h-[500px] flex flex-col">
             <GameComp onGameEnd={(data) => handleGameEnd(gType, data)} />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER HUB VIEW ---
  const gameCards = [
    { id: "typing", label: "Typing Test", icon: "keyboard", color: "indigo", desc: "Speed & Accuracy" },
    { id: "math", label: "Math Dots", icon: "functions", color: "amber", desc: "Logic Processing" },
    { id: "flip", label: "Flip Grid", icon: "grid_view", color: "emerald", desc: "Memory Matrix" },
    { id: "pattern", label: "Pattern Recon", icon: "psychology", color: "rose", desc: "Neural Recognition" }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 italic uppercase tracking-tighter">
          Training Grounds
        </h2>
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-red-100 text-red-600 rounded-full">
          <span className="material-symbols-outlined animate-pulse font-bold">emergency</span>
          <p className="font-black uppercase tracking-widest text-xs">
            Clear any mission to disable active protocols
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {gameCards.map((game) => (
          <div 
            key={game.id} 
            className="group relative bg-white p-10 rounded-[3rem] shadow-xl border-4 border-transparent hover:border-slate-900 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className={`size-24 rounded-3xl bg-${game.color}-100 text-${game.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <span className="material-symbols-outlined text-6xl">{game.icon}</span>
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 uppercase italic mb-2">{game.label}</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">{game.desc}</p>
            
            <button
              onClick={() => setSelectedGame(game.id)}
              className={`w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-${game.color}-600 shadow-xl transition-all active:scale-95`}
            >
              INITIALIZE
            </button>

            {/* Micro Leaderboard Badge */}
            {scores[game.id + "Test" || game.id]?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-50 w-full">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Top Performance</p>
                <div className="flex justify-center gap-2">
                  {scores[game.id + "Test" || game.id].slice(0, 3).map((s, i) => (
                    <div key={i} className="size-2 bg-slate-100 rounded-full" title={`Score: ${s.score}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-slate-400 font-medium text-sm italic">
          System Status: Audio Drivers Loaded. Biometric Bypass Ready.
        </p>
      </div>
    </div>
  );
};

export default GamesHub;