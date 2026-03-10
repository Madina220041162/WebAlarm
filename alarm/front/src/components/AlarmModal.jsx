import { useState, useEffect } from "react";
import { alarmAPI } from "../services/api";

export default function AlarmModal({ isOpen, onClose, onSave, initialDate = null, existingAlarm = null }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    label: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (existingAlarm) {
        // Edit existing alarm
        const alarmDate = new Date(existingAlarm.time);
        setFormData({
          date: alarmDate.toISOString().split("T")[0],
          time: alarmDate.toTimeString().slice(0, 5),
          label: existingAlarm.label || "",
        });
      } else if (initialDate) {
        // New alarm with suggested date
        const date = new Date(initialDate);
        setFormData({
          date: date.toISOString().split("T")[0],
          time: date.toTimeString().slice(0, 5) || "09:00",
          label: "",
        });
      } else {
        // New alarm with current date
        const now = new Date();
        setFormData({
          date: now.toISOString().split("T")[0],
          time: "09:00",
          label: "",
        });
      }
      setError("");
    }
  }, [isOpen, initialDate, existingAlarm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      if (dateTime < new Date()) {
        setError("Cannot set alarm in the past");
        setLoading(false);
        return;
      }

      const alarmData = {
        time: dateTime.toISOString(),
        label: formData.label || "Wake Up Battle",
      };

      if (existingAlarm) {
        await alarmAPI.update(existingAlarm._id, alarmData);
      } else {
        await alarmAPI.create(alarmData);
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save alarm");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">
            {existingAlarm ? "Edit Alarm" : "New Alarm Battle"}
          </h2>
          <button
            onClick={onClose}
            className="size-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
              Label
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Wake Up Challenge"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary outline-none transition-all font-semibold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary outline-none transition-all font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary outline-none transition-all font-semibold text-slate-900"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Saving..." : existingAlarm ? "Update" : "Create Alarm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
