import { useEffect, useState, useRef } from "react";
import { alarmAPI } from "../../services/api";
import { createAlarmSound, showAlarmNotification } from "../../utils/alarmSound";

export default function AlarmModal({ isOpen, onClose, selectedDate, selectedTime, onAlarmCreated, existingAlarm = null }) {
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [sound, setSound] = useState("rooster");
  const [sleeperType, setSleeperType] = useState("dream-drifter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Isolated preview sound ref
  const soundPreviewRef = useRef(null);

  // Stop only preview sound
  const stopPreview = () => {
    if (soundPreviewRef.current) {
      soundPreviewRef.current.stop();
      soundPreviewRef.current = null;
    }
  };

  // Sound options
  const soundOptions = [
    { value: "rooster", label: "🐓 Rooster", icon: "light_mode" },
    { value: "heavy-metal", label: "🎸 Heavy Metal Guitar", icon: "graphic_eq" },
    { value: "military-trumpet", label: "🎺 Military Trumpet", icon: "campaign" },
    { value: "classic-clock", label: "⏰ Classic Clock", icon: "alarm" },
    { value: "electronic-beep", label: "📡 Electronic Beep", icon: "sensors" },
  ];

  const sleeperTypes = [
    { value: "feather-sleeper", label: "🪶 Feather Sleeper", desc: "Light Sleeper", category: "light" },
    { value: "dream-drifter", label: "🌙 Dream Drifter", desc: "Light Sleeper", category: "light" },
    { value: "stone-bear", label: "🐻 Stone Bear", desc: "Heavy Sleeper", category: "heavy" },
    { value: "apocalypse-survivor", label: "💀 Apocalypse Survivor", desc: "Heavy Sleeper", category: "heavy" },
  ];

  // Initialize form on open
  useEffect(() => {
    stopPreview();
    if (!isOpen) return;

    if (existingAlarm) {
      const alarmDate = new Date(existingAlarm.time);
      setDate(alarmDate.toISOString().split("T")[0]);
      setTime(alarmDate.toTimeString().slice(0, 5));
      setLabel(existingAlarm.label || "");
      setSound(existingAlarm.sound || "rooster");
      setSleeperType(existingAlarm.sleeperType || "dream-drifter");
    } else {
      const now = new Date();
      setLabel("");
      setDate(selectedDate ? selectedDate.toISOString().split("T")[0] : now.toISOString().split("T")[0]);
      setTime(selectedTime || "09:00");
      setSound("rooster");
      setSleeperType("dream-drifter");
    }
  }, [isOpen, existingAlarm, selectedDate, selectedTime]);

  // Handle sound preview
  const handleSoundChange = (newSound) => {
    setSound(newSound);
    stopPreview();

    const audio = createAlarmSound(newSound);
    audio.isPreview = true;
    soundPreviewRef.current = audio;
    audio.start(true); // loop preview

    setTimeout(() => {
      if (audio.isPreview) audio.stop();
    }, 2000);
  };

  // Submit alarm (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    stopPreview();

    try {
      const [hours, minutes] = time.split(":").map(Number);
      const [year, month, day] = date.split("-").map(Number);
      let alarmDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

      if (alarmDateTime.getTime() <= Date.now()) {
        alarmDateTime.setDate(alarmDateTime.getDate() + 1);
      }

      const payload = {
        time: alarmDateTime.toISOString(),
        label: label || "Morning Battle",
        sound,
        sleeperType,
      };

      const id = existingAlarm?._id || existingAlarm?.id;
      if (id) {
        await alarmAPI.update(id, payload);
      } else {
        await alarmAPI.create(payload);
      }

      showAlarmNotification(payload.label);
      onAlarmCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col border-4 border-slate-100 dark:border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl font-bold">
                {existingAlarm ? "edit_notifications" : "add_alarm"}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 uppercase italic">
                {existingAlarm ? "Edit Battle" : "New Battle"}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Operation: Wake Up</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-8 py-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                Audio Protocol
              </label>
              <div className="grid grid-cols-1 gap-2">
                {soundOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSoundChange(option.value)}
                    className={`w-full px-5 py-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      sound === option.value ? "border-primary bg-primary/5 text-primary" : "border-slate-50 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3 font-bold text-sm">
                      <span className="material-symbols-outlined">{option.icon}</span>
                      {option.label}
                    </div>
                    {sound === option.value && <div className="size-2 rounded-full bg-primary animate-ping" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                Subject Classification
              </label>
              <div className="grid grid-cols-2 gap-2 pb-4">
                {sleeperTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSleeperType(type.value)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      sleeperType === type.value
                        ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                        : "border-slate-50 bg-slate-50 dark:bg-slate-800 hover:border-slate-200 dark:border-slate-600"
                    }`}
                  >
                    <div className="text-sm font-black text-slate-900 dark:text-slate-100 mb-0.5">{type.label}</div>
                    <div className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md inline-block ${
                      type.category === "heavy" ? "bg-red-100 text-red-600 dark:bg-red-600 dark:text-red-100" : "bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-blue-100"
                    }`}>
                      {type.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Syncing..." : existingAlarm ? "Confirm Changes" : "Deploy Battle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}