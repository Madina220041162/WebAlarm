import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import AlarmNotification from '../components/AlarmNotification';
import { alarmAPI } from '../services/api';
import { requestNotificationPermission } from '../utils/alarmSound';
import { useAuth } from '../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Alarm() {
  const { isGuest } = useAuth();
  const [alarms, setAlarms] = useState([]);
  const [guestMessage, setGuestMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [triggeredAlarm, setTriggeredAlarm] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Request notification permission
    requestNotificationPermission();

    socketRef.current = io(API_URL);
    socketRef.current.on('alarmTriggered', (data) => {
      console.log('Alarm triggered:', data);
      setTriggeredAlarm(data);
      fetchAlarms();
    });
    fetchAlarms();
    return () => socketRef.current?.disconnect();
  }, []);

  const fetchAlarms = async () => {
    try {
      const data = await alarmAPI.getAll();
      setAlarms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching alarms:', error);
    }
  };

  const handleDismissAlarm = async () => {
    if (triggeredAlarm) {
      try {
        await alarmAPI.delete(triggeredAlarm.id);
      } catch (error) {
        console.error("Error deleting alarm:", error);
      }
    }
    setTriggeredAlarm(null);
    fetchAlarms();
  };

  const handleSnoozeAlarm = async () => {
    if (triggeredAlarm) {
      try {
        const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
        await alarmAPI.create({
          time: snoozeTime.toISOString(),
          label: `${triggeredAlarm.label} (Snoozed)`,
        });
        await alarmAPI.delete(triggeredAlarm.id);
      } catch (error) {
        console.error("Error snoozing alarm:", error);
      }
    }
    setTriggeredAlarm(null);
    fetchAlarms();
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const handleGuestBlockedAction = () => {
    if (isGuest) {
      setGuestMessage('Please log in to set your alarm.');
      return true;
    }
    return false;
  };

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in zoom-in duration-500">
      {/* Left Column: Clock & Challenges */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        {isGuest && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold">
            Login to access all features.
          </div>
        )}
        {guestMessage && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            {guestMessage}
          </div>
        )}
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 text-danger font-bold text-sm mb-6 border border-danger/20">
              <span className="material-symbols-outlined text-lg animate-pulse">priority_high</span>
              Defuse Method Required!
            </div>
            <h2 className="text-[10rem] font-black tracking-tighter text-slate-900 leading-none clock-shadow mb-8">
              {formattedTime}
            </h2>
            <div className="flex gap-4 justify-center">
              <div className="glass-pill px-8 py-6 rounded-3xl text-center min-w-[120px]">
                <p className="text-4xl font-extrabold text-primary">00</p>
                <p className="text-[10px] font-bold uppercase text-slate-400 mt-1 tracking-widest">Minutes</p>
              </div>
              <div className="flex items-center text-4xl font-light text-slate-300">:</div>
              <div className="glass-pill px-8 py-6 rounded-3xl text-center min-w-[120px] ring-2 ring-primary/20">
                <p className="text-4xl font-extrabold text-primary">42</p>
                <p className="text-[10px] font-bold uppercase text-slate-400 mt-1 tracking-widest">Seconds</p>
              </div>
            </div>
            <p className="mt-8 text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">
              Until Next Punishment: Call to Boss
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center">
            <div className="size-20 rounded-3xl bg-amber-100 flex items-center justify-center mb-6 shadow-inner text-amber-500">
              <span className="material-symbols-outlined text-5xl">sports_esports</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">Win The Game</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Complete the pixel-art challenge to silence the beast.</p>
            <button
              onClick={() => handleGuestBlockedAction()}
              className="w-full py-4 bg-amber-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all"
            >
              Start Battle
            </button>
          </div>

          <div className="glass-card p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center">
            <div className="size-20 rounded-3xl bg-blue-100 flex items-center justify-center mb-6 shadow-inner text-blue-500">
              <span className="material-symbols-outlined text-5xl">coffee_maker</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">Upload Proof</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Photograph your coffee machine in active operation.</p>
            <button
              onClick={() => handleGuestBlockedAction()}
              className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all"
            >
              Open Camera
            </button>
          </div>

          <div className="glass-card p-8 rounded-xl hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer flex flex-col items-center text-center border-primary/20 bg-white/80">
            <div className="size-20 rounded-3xl bg-indigo-100 flex items-center justify-center mb-6 shadow-inner text-indigo-500">
              <span className="material-symbols-outlined text-5xl">face_6</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">Identity Check</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Smile for the camera to prove you are conscious.</p>
            <button
              onClick={() => handleGuestBlockedAction()}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all"
            >
              Verify Me
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Settings & Progress */}
      <div className="col-span-12 lg:col-span-4 space-y-8">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-slate-900">Active Alarms</h3>
            <span className="material-symbols-outlined text-slate-400">tune</span>
          </div>
          <div className="space-y-3">
            {alarms.map(alarm => (
              <label key={alarm._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white/40 cursor-pointer group hover:bg-white/60 transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      {alarm.enabled ? "notifications_active" : "notifications_off"}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-700 block">
                      {new Date(alarm.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{alarm.label}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={alarm.enabled}
                  readOnly
                  className="w-5 h-5 text-primary focus:ring-primary border-slate-300 rounded"
                />
              </label>
            ))}
            {alarms.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-4">No alarms set.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-8 rounded-xl flex flex-col items-center">
          <h3 className="text-sm font-extrabold mb-8 text-slate-500 uppercase tracking-widest text-center">Failure Progress</h3>
          <div className="relative size-56">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-slate-100" cx="112" cy="112" fill="transparent" r="95" stroke="currentColor" strokeWidth="12"></circle>
              <circle className="text-primary" cx="112" cy="112" fill="transparent" r="95" stroke="currentColor" strokeDasharray="596" strokeDashoffset="40" strokeLinecap="round" strokeWidth="12"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-900">92%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Defeat Level</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-4 rounded-2xl bg-white/50 border border-slate-100">
              <p className="text-2xl font-black text-primary">18</p>
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-1">Failed Starts</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/50 border border-slate-100">
              <p className="text-2xl font-black text-danger">LOW</p>
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-1">Social Credit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Alert */}
      <div className="fixed bottom-10 right-10 glass-card p-6 rounded-2xl flex items-center gap-5 max-w-sm border-l-8 border-primary animate-bounce-slow z-50">
        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-3xl">dangerous</span>
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm mb-1 uppercase tracking-tight">Public Exposure Protocol</h4>
          <p className="text-xs font-medium text-slate-500">Posting your 2012 browser history to LinkedIn in 42 seconds.</p>
        </div>
      </div>

      <AlarmNotification
        alarm={triggeredAlarm}
        onDismiss={handleDismissAlarm}
        onSnooze={handleSnoozeAlarm}
      />
    </div>
  );
}
