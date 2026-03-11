import { useEffect, useState, useRef } from "react";
import { createAlarmSound, showAlarmNotification } from "../utils/alarmSound";

export default function AlarmNotification({ alarm, onDismiss, onSnooze }) {
  const [isRinging, setIsRinging] = useState(true);
  const alarmSoundRef = useRef(null);
  const browserNotificationRef = useRef(null);

  useEffect(() => {
    if (!alarm) return;

    // Start alarm sound with the selected sound type
    if (isRinging) {
      alarmSoundRef.current = createAlarmSound(alarm.sound || "rooster");
      alarmSoundRef.current.start();

      // Show browser notification
      browserNotificationRef.current = showAlarmNotification(alarm);
    }

    return () => {
      if (alarmSoundRef.current) {
        alarmSoundRef.current.stop();
      }
      if (browserNotificationRef.current) {
        browserNotificationRef.current.close();
      }
    };
  }, [alarm, isRinging]);

  const handleDismiss = () => {
    setIsRinging(false);
    if (alarmSoundRef.current) {
      alarmSoundRef.current.stop();
    }
    if (browserNotificationRef.current) {
      browserNotificationRef.current.close();
    }
    onDismiss();
  };

  const handleSnooze = () => {
    setIsRinging(false);
    if (alarmSoundRef.current) {
      alarmSoundRef.current.stop();
    }
    if (browserNotificationRef.current) {
      browserNotificationRef.current.close();
    }
    onSnooze();
  };

  if (!alarm) return null;

  console.log("🔔 AlarmNotification rendering with alarm:", alarm);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in duration-300 relative z-[9999]">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center size-24 rounded-full mb-6 ${
            isRinging ? "bg-danger animate-pulse" : "bg-primary"
          }`}>
            <span className="material-symbols-outlined text-6xl text-white">
              {isRinging ? "notifications_active" : "notifications"}
            </span>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {isRinging ? "⏰ ALARM!" : "Alarm Triggered"}
          </h2>
          
          <p className="text-lg font-bold text-slate-600 mb-1">
            {alarm.label || "Wake Up Battle"}
          </p>
          
          <p className="text-sm text-slate-400 font-semibold">
            {new Date(alarm.time).toLocaleString()}
          </p>

          {alarm.sleeperType && (
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {alarm.sleeperType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDismiss}
            className="w-full py-4 px-6 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
          >
            Dismiss Alarm
          </button>
          
          <button
            onClick={handleSnooze}
            className="w-full py-4 px-6 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Snooze 5 Minutes
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
            Complete challenge to stop alarm
          </p>
        </div>
      </div>
    </div>
  );
}
