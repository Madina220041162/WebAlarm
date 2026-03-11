import { useEffect, useState, useRef } from "react";
import { alarmAPI } from "../../services/api";
import { createAlarmSound } from "../../utils/alarmSound";

export default function AlarmModal({ isOpen, onClose, selectedDate, selectedTime, onAlarmCreated, existingAlarm = null }) {
  const [label, setLabel] = useState("");
  const [date, setDate] = useState(
    selectedDate ? selectedDate.toISOString().split("T")[0] : ""
  );
  const [time, setTime] = useState(selectedTime || "09:00");
  const [sound, setSound] = useState("rooster");
  const [sleeperType, setSleeperType] = useState("dream-drifter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const soundPreviewRef = useRef(null);

  const playPreviewSound = (soundType) => {
    // Stop previous sound
    if (soundPreviewRef.current) {
      soundPreviewRef.current.stop();
    }
    // Play new sound for 2 seconds
    soundPreviewRef.current = createAlarmSound(soundType);
    soundPreviewRef.current.start();
    setTimeout(() => {
      if (soundPreviewRef.current) {
        soundPreviewRef.current.stop();
      }
    }, 2000);
  };

  const handleSoundChange = (newSound) => {
    setSound(newSound);
    playPreviewSound(newSound);
  };

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
    { value: "silent-owl", label: "🦉 Silent Owl", desc: "Light Sleeper", category: "light" },
    { value: "stone-bear", label: "🐻 Stone Bear", desc: "Heavy Sleeper", category: "heavy" },
    { value: "coma-titan", label: "🪨 Coma Titan", desc: "Heavy Sleeper", category: "heavy" },
    { value: "apocalypse-survivor", label: "💀 Apocalypse Survivor", desc: "Heavy Sleeper", category: "heavy" },
  ];

  useEffect(() => {
    if (!isOpen) return;

    if (existingAlarm) {
      const alarmDate = new Date(existingAlarm.time);
      const datePart = alarmDate.toISOString().split("T")[0];
      const hour = String(alarmDate.getHours()).padStart(2, "0");
      const minute = String(alarmDate.getMinutes()).padStart(2, "0");
      setLabel(existingAlarm.label || "");
      setDate(datePart);
      setTime(`${hour}:${minute}`);
      setSound(existingAlarm.sound || "rooster");
      setSleeperType(existingAlarm.sleeperType || "dream-drifter");
      return;
    }

    setLabel("");
    setDate(selectedDate ? selectedDate.toISOString().split("T")[0] : "");
    setTime(selectedTime || "09:00");
    setSound("rooster");
    setSleeperType("dream-drifter");
  }, [isOpen, existingAlarm, selectedDate, selectedTime]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const alarmDateTime = new Date(`${date}T${time}`);
      const payload = {
        time: alarmDateTime.toISOString(),
        label: label || "Alarm Battle",
        sound,
        sleeperType,
      };

      if (existingAlarm?._id) {
        await alarmAPI.update(existingAlarm._id, payload);
      } else {
        await alarmAPI.create(payload);
      }

      onAlarmCreated();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create alarm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">alarm_add</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              {existingAlarm ? "Edit Battle" : "Schedule Battle"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          {error && (
            <div className="mb-3 p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-semibold">
              {error}
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Battle Name
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Morning Wake-up Challenge"
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none font-semibold text-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none font-semibold text-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none font-semibold text-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Alarm Sound (Click to Preview)
            </label>
            <div className="space-y-2">
              {soundOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSoundChange(option.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-left font-semibold transition-all ${
                    sound === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 text-slate-800 hover:border-primary hover:scale-105"
                  }`}
                >
                  <span className="text-sm">{option.label}</span>
                  <span className="text-xs text-slate-500 ml-2">🔊 Preview</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Sleeper Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sleeperTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSleeperType(type.value)}
                  className={`p-2 rounded-xl border-2 text-left transition-all ${
                    sleeperType === type.value
                      ? "border-primary bg-primary/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{type.label}</div>
                  <div className="text-[8px] font-bold uppercase text-slate-400 mt-0.5">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              {loading ? (existingAlarm ? "Saving..." : "Creating...") : (existingAlarm ? "Save Changes" : "Create Battle")}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
