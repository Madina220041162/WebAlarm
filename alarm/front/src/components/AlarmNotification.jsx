import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { createAlarmSound, showAlarmNotification } from "../utils/alarmSound";

export default function AlarmNotification({
  alarm,
  proofChallenge,
  proofVerified,
  onOpenProof,
  onDismiss,
  onSnooze,
}) {
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
    if (!proofVerified) return;

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

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300 relative z-[9999]">
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
          {proofChallenge && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Required Proof</p>
              <p className="font-bold text-slate-800">
                Upload a clear photo containing: <span className="text-primary uppercase">{proofChallenge.target}</span>
              </p>
              <p className={`text-xs font-semibold mt-2 ${proofVerified ? "text-emerald-600" : "text-amber-600"}`}>
                {proofVerified ? "Proof accepted. You can dismiss the alarm." : "Proof not verified yet. Dismiss is locked."}
              </p>
            </div>
          )}

          <button
            onClick={onOpenProof}
            className="w-full py-4 px-6 rounded-xl border-2 border-primary/20 text-primary font-bold text-lg hover:bg-primary/5 transition-all"
          >
            Open Upload Proof
          </button>

          <button
            onClick={handleDismiss}
            disabled={!proofVerified}
            className="w-full py-4 px-6 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>,
    document.body
  );
}
