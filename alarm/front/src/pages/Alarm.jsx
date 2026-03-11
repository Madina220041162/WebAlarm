import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  getRandomProofTarget,
  saveActiveProofChallenge,
  getActiveProofChallenge,
} from '../utils/proofChallenge';

const API_URL = import.meta.env.VITE_API_URL;

export default function Alarm() {
  const { user, explosionMode } = useAuth();
  const [alarms, setAlarms] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newAlarm, setNewAlarm] = useState({ time: "", label: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setActiveChallenge(getActiveProofChallenge());

    socketRef.current = io(API_URL);
    socketRef.current.on('alarmTriggered', (data) => {
      console.log('Alarm triggered:', data);
      const challenge = {
        alarmId: data.id,
        target: getRandomProofTarget(),
        issuedAt: Date.now(),
      };
      saveActiveProofChallenge(challenge);
      setActiveChallenge(challenge);
      fetchAlarms();
    });

    const onChallengeUpdate = () => setActiveChallenge(getActiveProofChallenge());
    window.addEventListener('proof-challenge-updated', onChallengeUpdate);

    fetchAlarms();
    return () => {
      window.removeEventListener('proof-challenge-updated', onChallengeUpdate);
      socketRef.current?.disconnect();
    };
  }, []);

  const fetchAlarms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/alarms`);
      const data = await res.json();
      setAlarms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching alarms:', error);
    }
  };

  const handleAddAlarm = async (e) => {
    e.preventDefault();
    if (!newAlarm.time) return;

    try {
      // Determine next occurrence of this time
      const [hours, minutes] = newAlarm.time.split(':');
      const timeDate = new Date();
      timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      if (timeDate < new Date()) timeDate.setDate(timeDate.getDate() + 1);

      const res = await fetch(`${API_URL}/api/alarms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time: timeDate.toISOString(),
          label: newAlarm.label || 'Alarm',
          userId: user?._id
        }),
      });

      if (res.ok) {
        setNewAlarm({ time: "", label: "" });
        setIsAdding(false);
        fetchAlarms();
      }
    } catch (error) {
      console.error('Error adding alarm:', error);
    }
  };

  const handleDeleteAlarm = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/alarms/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAlarms();
    } catch (error) {
      console.error('Error deleting alarm:', error);
    }
  };

  const handleToggleAlarm = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/alarms/${id}/toggle`, { method: 'POST' });
      if (res.ok) fetchAlarms();
    } catch (error) {
      console.error('Error toggling alarm:', error);
    }
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in zoom-in duration-500">
      {/* Left Column: Clock & Challenges */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-6 border transition-all duration-300 ${explosionMode ? 'bg-danger/20 text-danger border-danger/40 animate-bounce' : 'bg-primary/10 text-primary border-primary/20'}`}>
              <span className="material-symbols-outlined text-lg animate-pulse">
                {explosionMode ? 'warning' : 'notifications_active'}
              </span>
              {explosionMode ? 'DEFUSE METHOD REQUIRED IMMEDIATELY!' : 'System Standby'}
            </div>
            <h2 className="text-[10rem] font-black tracking-tighter text-slate-900 dark:text-white leading-none clock-shadow mb-8 transition-all duration-300">
              {formattedTime}
            </h2>
            <div className="flex gap-4 justify-center">
              <div className="glass-pill px-8 py-6 rounded-3xl text-center min-w-[120px]">
                <p className="text-4xl font-extrabold text-primary">
                  {String(currentTime.getMinutes()).padStart(2, '0')}
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-400 mt-1 tracking-widest">Minutes</p>
              </div>
              <div className="flex items-center text-4xl font-light text-slate-300">:</div>
              <div className="glass-pill px-8 py-6 rounded-3xl text-center min-w-[120px] ring-2 ring-primary/20">
                <p className="text-4xl font-extrabold text-primary">
                  {String(currentTime.getSeconds()).padStart(2, '0')}
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-400 mt-1 tracking-widest">Seconds</p>
              </div>
            </div>
            <p className="mt-8 text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">
              {explosionMode ? 'Next Punishment: LinkedIn Post Leak' : 'Awaiting Mission'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center">
            <div className="size-20 rounded-3xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6 shadow-inner text-amber-500">
              <span className="material-symbols-outlined text-5xl">sports_esports</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Win The Game</h3>
            <p className="text-xs opacity-60 leading-relaxed mb-6">Complete the pixel-art challenge to silence the beast.</p>
            <button onClick={() => navigate('/games')} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all">Start Battle</button>
          </div>

          <div className="glass-card p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center">
            <div className="size-20 rounded-3xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 shadow-inner text-blue-500">
              <span className="material-symbols-outlined text-5xl">coffee_maker</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Upload Proof</h3>
            <p className="text-xs opacity-60 leading-relaxed mb-2">
              {activeChallenge
                ? `Required now: upload a photo containing '${activeChallenge.target}'.`
                : 'No active proof challenge yet. It appears when an alarm rings.'}
            </p>
            {activeChallenge && (
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                Target: {activeChallenge.target}
              </p>
            )}
            <button onClick={() => navigate('/files')} className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all">Open Camera</button>
          </div>

          <div className="glass-card p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center border-primary/20">
            <div className="size-20 rounded-3xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6 shadow-inner text-indigo-500">
              <span className="material-symbols-outlined text-5xl">face_6</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Identity Check</h3>
            <p className="text-xs opacity-60 leading-relaxed mb-6">Scan your face with AI — verifies you're awake and <span className="font-bold">dismisses the alarm</span>.</p>
            <button onClick={() => navigate('/identity-check')} className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all">Scan My Face</button>
          </div>
        </div>
      </div>

      {/* Right Column: Alarms & Progress */}
      <div className="col-span-12 lg:col-span-4 space-y-8">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Active Alarms</h3>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">{isAdding ? 'close' : 'add'}</span>
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAddAlarm} className="mb-8 space-y-4 p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/10 animate-in slide-in-from-top duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2">Time</label>
                <input
                  type="time"
                  required
                  value={newAlarm.time}
                  onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                  className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2">Label</label>
                <input
                  type="text"
                  placeholder="e.g., Morning Coffee"
                  value={newAlarm.label}
                  onChange={(e) => setNewAlarm({ ...newAlarm, label: e.target.value })}
                  className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                Schedule Defusal
              </button>
            </form>
          )}

          <div className="space-y-3">
            {alarms.map(alarm => (
              <div key={alarm._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 group hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all relative overflow-hidden">
                <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => handleToggleAlarm(alarm._id)}>
                  <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${alarm.enabled ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-xl">
                      {alarm.enabled ? "notifications_active" : "notifications_off"}
                    </span>
                  </div>
                  <div>
                    <span className={`font-bold text-sm block transition-opacity ${alarm.enabled ? 'opacity-100' : 'opacity-40'}`}>
                      {new Date(alarm.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    <span className="text-[10px] opacity-40 font-bold uppercase">{alarm.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={alarm.enabled}
                    onChange={() => handleToggleAlarm(alarm._id)}
                    className="w-5 h-5 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                  />
                  <button
                    onClick={() => handleDeleteAlarm(alarm._id)}
                    className="p-2 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {alarms.length === 0 && (
              <p className="text-xs opacity-40 italic text-center py-10">No alarms set for today.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-10 rounded-3xl flex flex-col items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl">trending_down</span>
          </div>
          
          <h3 className="text-xs font-black mb-10 opacity-40 uppercase tracking-[0.3em] text-center border-b border-slate-200 dark:border-white/5 pb-4 w-full">
            Failure Progress
          </h3>
          
          {/* Functional Circle Progress */}
          <div className="relative size-60">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                className="text-slate-100 dark:text-slate-800/50" 
                cx="120" cy="120" r="105" 
                fill="transparent" stroke="currentColor" strokeWidth="16"
              ></circle>
              {(() => {
                const total = alarms.length || 1;
                const pastAlarms = alarms.filter(a => new Date(a.time) < currentTime).length;
                const percent = Math.min(Math.round((pastAlarms / total) * 100), 100);
                const offset = 660 - (660 * percent) / 100;
                return (
                  <circle 
                    className="text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]" 
                    cx="120" cy="120" r="105" 
                    fill="transparent" stroke="currentColor" strokeWidth="16" 
                    strokeDasharray="660" strokeDashoffset={offset} 
                    strokeLinecap="round"
                  ></circle>
                );
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {(() => {
                const total = alarms.length || 1;
                const pastAlarms = alarms.filter(a => new Date(a.time) < currentTime).length;
                const percent = Math.min(Math.round((pastAlarms / total) * 100), 100);
                return (
                  <>
                    <span className="text-6xl font-black text-slate-900 dark:text-white transition-all duration-300">
                      {percent}%
                    </span>
                    <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-2">Defeat Level</span>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 w-full">
            {(() => {
              const pastAlarms = alarms.filter(a => new Date(a.time) < currentTime).length;
              const creditText = pastAlarms === 0 ? "EXCELLENT" : pastAlarms < 2 ? "STABLE" : pastAlarms < 4 ? "LOW" : "BANKRUPT";
              const creditColor = pastAlarms === 0 ? "text-success" : pastAlarms < 2 ? "text-primary" : "text-danger";

              return (
                <>
                  <div className="text-center p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover:border-primary/20 transition-all">
                    <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{pastAlarms}</p>
                    <p className="text-[10px] uppercase opacity-40 font-bold tracking-wider mt-1">Failed Starts</p>
                  </div>
                  <div className="text-center p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover:border-indigo-400/20 transition-all">
                    <p className={`text-xl font-black ${creditColor} tracking-tighter`}>{creditText}</p>
                    <p className="text-[10px] uppercase opacity-40 font-bold tracking-wider mt-1">Social Credit</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
