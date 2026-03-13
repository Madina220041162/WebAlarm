import { useState, useEffect, useRef, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";
import {
  getRandomProofTarget,
  saveActiveProofChallenge,
  getProofVerificationResult,
  clearProofVerificationResult,
  clearActiveProofChallenge,
} from "../utils/proofChallenge";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CalendarPage() {
  // Destructure global functions from AuthContext
  const { user, loading, startGlobalAlarm, stopGlobalAlarm } = useAuth();
  const navigate = useNavigate();
  
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [editingAlarm, setEditingAlarm] = useState(null);
  
  const [triggeredAlarm, setTriggeredAlarm] = useState(null);
  const [proofChallenge, setProofChallenge] = useState(null);
  const [proofVerified, setProofVerified] = useState(false);

  // Socket remains local to the page to listen for triggers
  const socketRef = useRef(null);

  const assignProofChallenge = useCallback((alarmData) => {
    const challenge = {
      alarmId: alarmData.id || alarmData._id,
      target: getRandomProofTarget(),
      issuedAt: Date.now(),
    };

    setProofChallenge(challenge);
    setProofVerified(false);

    saveActiveProofChallenge(challenge);
    clearProofVerificationResult();
  }, []);

  const refreshProofStatus = useCallback(() => {
    if (!proofChallenge) return;

    const result = getProofVerificationResult();

    const isValid = Boolean(
      result &&
        result.passed &&
        result.alarmId === proofChallenge.alarmId &&
        result.target === proofChallenge.target &&
        result.verifiedAt >= proofChallenge.issuedAt
    );

    if (isValid) {
      setProofVerified(true);
      // STOP ALARM GLOBALLY WHEN PROOF COMPLETED
      stopGlobalAlarm();
    }
  }, [proofChallenge, stopGlobalAlarm]);

  useEffect(() => {
    fetchAlarms();
    requestNotificationPermission();

    socketRef.current = io(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketRef.current.on("alarmTriggered", (data) => {
      console.log("ALARM ACTIVE:", data);

      setProofVerified(false);
      setTriggeredAlarm(data);
      assignProofChallenge(data);

      // START GLOBAL ALARM (Stays playing even if we change pages)
      startGlobalAlarm(data);

      setTimeout(() => fetchAlarms(), 500);
    });

    return () => {
      socketRef.current?.disconnect();
      // Notice: No stopGlobalAlarm() here. Navigation won't kill the noise anymore!
    };
  }, [assignProofChallenge, startGlobalAlarm]);

  useEffect(() => {
    refreshProofStatus();
  }, [refreshProofStatus]);

  useEffect(() => {
    const onProofUpdate = () => refreshProofStatus();
    window.addEventListener("proof-verification-updated", onProofUpdate);
    return () => window.removeEventListener("proof-verification-updated", onProofUpdate);
  }, [refreshProofStatus]);

  const fetchAlarms = async () => {
    try {
      const data = await alarmAPI.getAll();
      setAlarms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching alarms:", error);
    }
  };

  const handleDateClick = (date, time = null) => {
    setEditingAlarm(null);
    setSelectedDate(date);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleEditAlarm = (alarm) => {
    setEditingAlarm(alarm);
    setSelectedDate(new Date(alarm.time));
    setSelectedTime(null);
    setIsModalOpen(true);
  };

  const handleDeleteAlarm = async (alarmId) => {
    try {
      await alarmAPI.delete(alarmId);
      fetchAlarms();
    } catch (error) {
      console.error("Error deleting alarm:", error);
    }
  };

  const handleDismissAlarm = async () => {
    if (!triggeredAlarm) return;

    if (!proofVerified) {
      alert("You must complete the challenge before stopping the alarm!");
      return;
    }

    try {
      const idToDismiss = triggeredAlarm.id || triggeredAlarm._id;
      await alarmAPI.dismiss(idToDismiss, "mission_complete");

      // Stop global sound upon manual dismissal
      stopGlobalAlarm();

      setTriggeredAlarm(null);
      setProofChallenge(null);
      setProofVerified(false);

      clearActiveProofChallenge();
      clearProofVerificationResult();

      fetchAlarms();

    } catch (error) {
      console.error("Failed to disarm system:", error);
    }
  };

  const handleSnoozeAlarm = async () => {
    if (triggeredAlarm) {
      try {
        const idToSnooze = triggeredAlarm.id || triggeredAlarm._id;
        const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
        await alarmAPI.create({
          time: snoozeTime.toISOString(),
          label: `${triggeredAlarm.label} (Snoozed)`,
        });
        await alarmAPI.delete(idToSnooze);
      } catch (error) {
        console.error("Error snoozing alarm:", error);
      }
    }

    // Stop sound on snooze
    stopGlobalAlarm();

    setTriggeredAlarm(null);
    setProofChallenge(null);
    setProofVerified(false);

    clearActiveProofChallenge();
    clearProofVerificationResult();

    fetchAlarms();
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold animate-pulse text-slate-900">
        Synchronizing Mission Data...
      </div>
    );

  return (
    <div className="animate-in fade-in zoom-in duration-500 pb-20">
      <div className="glass-card rounded-xl p-8 min-h-[600px] flex flex-col">

        <CalendarHeader
          view={view}
          setView={setView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          darkMode={false}
          setDarkMode={() => {}}
        />

        <div className="flex-1 mt-8">

          {view === "day" && (
            <DayView
              date={currentDate}
              alarms={alarms}
              onTimeSlotClick={handleDateClick}
            />
          )}

          {view === "week" && (
            <WeekView
              date={currentDate}
              alarms={alarms}
              onTimeSlotClick={handleDateClick}
            />
          )}

          {view === "year" && (
            <YearView
              date={currentDate}
              alarms={alarms}
            />
          )}

          {view === "month" && (
            <MonthView
              date={currentDate}
              alarms={alarms}
              onDateClick={handleDateClick}
            />
          )}

        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">event_available</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
              Upcoming
            </p>
            <p className="font-bold text-slate-800">
              {alarms.filter((a) => new Date(a.time) > new Date()).length} Battles Scheduled
            </p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className={`size-12 rounded-xl flex items-center justify-center ${triggeredAlarm ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-orange-500'}`}>
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
              Status
            </p>
            <p className={`font-bold ${triggeredAlarm ? 'text-red-600' : 'text-slate-800'}`}>
              {triggeredAlarm ? "CRITICAL: BATTLE ACTIVE" : "Resistance Active"}
            </p>
          </div>
        </div>

        <div
          className="glass-card p-6 rounded-xl flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform bg-primary text-white"
          onClick={() => handleDateClick(new Date())}
        >
          <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined">add_alarm</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-white/60 tracking-widest leading-none mb-1">
              Quick Action
            </p>
            <p className="font-bold">Schedule New Battle</p>
          </div>
        </div>
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
        onAlarmCreated={fetchAlarms}
      />

      <AlarmNotification
        alarm={triggeredAlarm}
        proofChallenge={proofChallenge}
        proofVerified={proofVerified}
        onOpenProof={() => navigate("/files")}
        onScanVerified={() => setProofVerified(true)}
        onDismiss={handleDismissAlarm}
        onSnooze={handleSnoozeAlarm}
      />
    </div>
  );
}