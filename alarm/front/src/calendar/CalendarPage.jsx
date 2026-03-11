import { useState, useEffect, useRef } from "react";
import CalendarHeader from "./CalendarHeader";
import DayView from "./views/DayView";
import WeekView from "./views/WeekView";
import MonthView from "./views/MonthView";
import YearView from "./views/YearView";
import AlarmModal from "./components/AlarmModal";
import AlarmNotification from "../components/AlarmNotification";
import { alarmAPI } from "../services/api";
import { requestNotificationPermission } from "../utils/alarmSound";
import io from "socket.io-client";
import { useAuth } from "../auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function CalendarPage() {
  const { canManageAlarms, isGuest } = useAuth();
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [editingAlarm, setEditingAlarm] = useState(null);
  const [guestMessage, setGuestMessage] = useState("");
  const [triggeredAlarm, setTriggeredAlarm] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchAlarms();

    // Request notification permission on mount
    requestNotificationPermission();

    // Setup socket connection for real-time alarm triggers
    console.log("Connecting to Socket.IO at:", API_URL);
    socketRef.current = io(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketRef.current.on("connect", () => {
      console.log("✓ Socket.IO connected:", socketRef.current.id);
    });

    socketRef.current.on("alarmTriggered", (data) => {
      console.log("ALARM TRIGGERED EVENT:", data);
      console.log("Setting triggeredAlarm state:", data);
      setTriggeredAlarm(data);
      // Refresh alarms list
      setTimeout(() => fetchAlarms(), 500);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("✗ Socket.IO connection error:", error);
    });

    socketRef.current.on("disconnect", () => {
      console.log("✗ Socket.IO disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const fetchAlarms = async () => {
    try {
      const data = await alarmAPI.getAll();
      setAlarms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching alarms:", error);
    }
  };

  const handleDateClick = (date, time = null) => {
    if (!canManageAlarms) {
      setGuestMessage("Please log in to set your alarm.");
      return;
    }

    setEditingAlarm(null);
    setSelectedDate(date);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleEditAlarm = (alarm) => {
    if (!canManageAlarms) {
      setGuestMessage("Please log in to set your alarm.");
      return;
    }

    setEditingAlarm(alarm);
    setSelectedDate(new Date(alarm.time));
    setSelectedTime(null);
    setIsModalOpen(true);
  };

  const handleDeleteAlarm = async (alarmId) => {
    if (!canManageAlarms) {
      setGuestMessage("Please log in to set your alarm.");
      return;
    }

    try {
      await alarmAPI.delete(alarmId);
      fetchAlarms();
    } catch (error) {
      console.error("Error deleting alarm:", error);
    }
  };

  const handleAlarmCreated = () => {
    fetchAlarms();
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
        // Create a new alarm 5 minutes from now
        const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
        await alarmAPI.create({
          time: snoozeTime.toISOString(),
          label: `${triggeredAlarm.label} (Snoozed)`,
        });
        // Delete the old alarm
        await alarmAPI.delete(triggeredAlarm.id);
      } catch (error) {
        console.error("Error snoozing alarm:", error);
      }
    }
    setTriggeredAlarm(null);
    fetchAlarms();
  };

  function renderView() {
    switch (view) {
      case "day":
        return <DayView date={currentDate} alarms={alarms} onTimeSlotClick={handleDateClick} />;
      case "week":
        return <WeekView date={currentDate} alarms={alarms} onTimeSlotClick={handleDateClick} />;
      case "year":
        return <YearView date={currentDate} alarms={alarms} />;
      default:
        return <MonthView date={currentDate} alarms={alarms} onDateClick={handleDateClick} />;
    }
  }

  return (
    <div className="animate-in fade-in zoom-in duration-500 pb-20">
      <div className="glass-card rounded-xl p-8 min-h-[600px] flex flex-col">
        {isGuest && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold">
            Login to access all features.
          </div>
        )}
        {guestMessage && (
          <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            {guestMessage}
          </div>
        )}

        <CalendarHeader
          view={view}
          setView={setView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          darkMode={false} // Prototype is light-themed/colorful
          setDarkMode={() => { }}
        />

        <div className="flex-1 mt-8">
          {renderView()}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">event_available</span>
          </div>
          <div>

      <AlarmNotification
        alarm={triggeredAlarm}
        onDismiss={handleDismissAlarm}
        onSnooze={handleSnoozeAlarm}
      />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Upcoming</p>
            <p className="font-bold text-slate-800">{alarms.filter(a => new Date(a.time) > new Date()).length} Battles Scheduled</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Status</p>
            <p className="font-bold text-slate-800">Resistance Active</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => handleDateClick(new Date())}>
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined">add_alarm</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Quick Action</p>
            <p className="font-bold text-slate-800">Schedule New Battle</p>
          </div>
        </div>
      </div>

      <div className="glass-card mt-6 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-900">Manage Battles</h3>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {alarms.length} total
          </span>
        </div>

        {alarms.length === 0 ? (
          <p className="text-sm text-slate-500 font-semibold">No alarms yet. Create your first battle.</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {alarms.map((alarm) => (
              <div key={alarm._id} className="rounded-xl border border-slate-200 bg-white/60 p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{alarm.label || "Alarm Battle"}</p>
                  <p className="text-xs text-slate-500 font-semibold">
                    {new Date(alarm.time).toLocaleString()} • {alarm.sound || "rooster"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditAlarm(alarm)}
                    className="px-3 py-2 rounded-lg bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAlarm(alarm._id)}
                    className="px-3 py-2 rounded-lg bg-danger/10 text-danger font-bold text-xs hover:bg-danger/20 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlarmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAlarm(null);
        }}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        existingAlarm={editingAlarm}
        onAlarmCreated={handleAlarmCreated}
      />
    </div>
  );
}
