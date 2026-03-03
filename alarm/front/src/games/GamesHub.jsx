import React, { useState, useEffect } from "react";
import TypingTest from "./TypingTest";
import MathDots from "./MathDots";
import FlipGrid from "./FlipGrid";

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
      if (response.ok) fetchScores();
    } catch (error) {
      console.error("Error saving game score:", error);
    }
  };

  if (selectedGame) {
    const GameComp = selectedGame === 'typing' ? TypingTest : selectedGame === 'math' ? MathDots : FlipGrid;
    const gType = selectedGame === 'typing' ? 'typingTest' : selectedGame === 'math' ? 'mathDots' : 'flipGrid';

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={() => setSelectedGame(null)}
          className="glass-pill px-6 py-3 rounded-xl font-bold text-slate-600 flex items-center gap-2 hover:text-primary"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Hub
        </button>
        <div className="glass-card rounded-xl p-8 min-h-[500px]">
          <GameComp onGameEnd={(data) => handleGameEnd(gType, data)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in zoom-in duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-10 rounded-xl hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center">
          <div className="size-24 rounded-3xl bg-indigo-100 flex items-center justify-center mb-8 shadow-inner text-indigo-500">
            <span className="material-symbols-outlined text-6xl">keyboard</span>
          </div>
          <h3 className="text-xl font-extrabold mb-3 text-slate-800">Typing Test</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">Type fast and accurate. No backspacing allowed in this battle!</p>
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-1">Personal Best</span>
            <span className="text-2xl font-black text-primary">{scores.typingTest[0]?.score || 0}</span>
          </div>
          <button onClick={() => setSelectedGame("typing")} className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all">
            Initialize Battle
          </button>
        </div>

        <div className="glass-card p-10 rounded-xl hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center">
          <div className="size-24 rounded-3xl bg-amber-100 flex items-center justify-center mb-8 shadow-inner text-amber-500">
            <span className="material-symbols-outlined text-6xl">functions</span>
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

        <div className="glass-card p-10 rounded-xl hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center">
          <div className="size-24 rounded-3xl bg-secondary/10 flex items-center justify-center mb-8 shadow-inner text-secondary">
            <span className="material-symbols-outlined text-6xl">grid_view</span>
          </div>
          <h3 className="text-xl font-extrabold mb-3 text-slate-800">Flip Grid</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">Match memory patterns under extreme pressure.</p>
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-1">Personal Best</span>
            <span className="text-2xl font-black text-secondary">{scores.flipGrid[0]?.score || 0}</span>
          </div>
          <button onClick={() => setSelectedGame("flip")} className="w-full py-4 bg-secondary text-white rounded-2xl font-bold shadow-lg shadow-secondary/30 hover:shadow-secondary/40 transition-all">
            Enter Pattern Zone
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">emoji_events</span>
            <h3 className="text-xl font-black text-slate-900">Hall of Shame Leaderboard</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(scores).flatMap(([type, list]) =>
              list.map((s, i) => (
                <div key={`${type}-${i}`} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white/40">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-300">#{i + 1}</div>
                    <div>
                      <span className="font-bold text-slate-700 block">{s.playerName}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{type.replace(/Test|Dots|Grid/, '')}</span>
                    </div>
                  </div>
                  <span className="text-xl font-black text-primary">{s.score}</span>
                </div>
              ))
            ).slice(0, 10)}
          </div>
        </div>

        <div className="glass-card p-12 rounded-xl flex flex-col items-center text-center justify-center">
          <div className="size-24 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-6 animate-pulse">
            <span className="material-symbols-outlined text-5xl">warning</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">Are you ready to fail?</h3>
          <p className="text-slate-500 font-medium mb-8 max-w-xs">Winning a game silences the alarm, but failing adds points to your Hall of Shame record.</p>
          <div className="flex gap-4">
            <div className="glass-pill px-6 py-3 rounded-xl font-bold text-slate-400">Patience: 0%</div>
            <div className="glass-pill px-6 py-3 rounded-xl font-bold text-danger">Volume: MAX</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesHub;
