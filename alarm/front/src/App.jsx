// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./auth/ProtectedRoute";
import CalendarPage from "./calendar/CalendarPage";
import Alarm from "./pages/Alarm";
import Notes from "./pages/Notes";
import FileUpload from "./pages/FileUpload";
import GamesHub from "./games/GamesHub";
import Settings from "./pages/Settings";
import IdentityCheck from "./pages/IdentityCheck";
import Sidebar from "./components/Sidebar";
import InteractiveWave from "./components/InteractiveWave";
import AlarmNotification from "./components/AlarmNotification";
import "./App.css";

export default function App() {
  const { activeAlarmData, stopGlobalAlarm, alarmAudioReady, resumeGlobalAlarmAudio } = useAuth();
  const [proofVerified, setProofVerified] = useState(false);

  /**
   * handleMissionSuccess
   * This is the "Kill Switch." 
   * It is called by GamesHub (on win) and AlarmNotification (on face scan).
   */
 // src/App.jsx

const handleMissionSuccess = () => {
  setProofVerified(true);
  
  // This must set activeAlarmData to null in your AuthContext
  stopGlobalAlarm(); 
  
  window.dispatchEvent(new Event("proof-verification-updated"));
};

  /**
   * handleDismissAlarm
   * Manual stop (only used if the user manually closes the modal after verification)
   */
  const handleDismissAlarm = () => {
    setProofVerified(false);
    stopGlobalAlarm();
  };

  // Reset verification when a brand new alarm starts ringing
  useEffect(() => {
    if (activeAlarmData) {
      setProofVerified(false);
    }
  }, [activeAlarmData]);

  return (
    <>
      <InteractiveWave />

      {/* ALARM OVERLAY 
          - onScanVerified={handleMissionSuccess} stops alarm after FACE SCAN
      */}
      {activeAlarmData && (
        <AlarmNotification
          alarm={activeAlarmData}
          proofVerified={proofVerified}
          alarmAudioReady={alarmAudioReady}
          onResumeAudio={resumeGlobalAlarmAudio}
          onScanVerified={handleMissionSuccess} 
          onDismiss={handleDismissAlarm}
          onSnooze={handleDismissAlarm} 
        />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <DashboardLayout title="Active" subtitle="Alarms">
              <Alarm />
            </DashboardLayout>
          }
        />

        <Route
          path="/calendar"
          element={
            <DashboardLayout title="Mission" subtitle="Schedule">
              <CalendarPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/notes"
          element={
            <DashboardLayout title="Penalty" subtitle="Notes">
              <Notes />
            </DashboardLayout>
          }
        />

        <Route
          path="/files"
          element={
            <DashboardLayout title="Vault" subtitle="Storage">
              <FileUpload onObjectDetected={handleMissionSuccess} />
            </DashboardLayout>
          }
        />

        {/* GAMES HUB 
            - onGameWin={handleMissionSuccess} stops alarm after WINNING A GAME
        */}
        <Route
          path="/games"
          element={
            <DashboardLayout title="Training" subtitle="Grounds">
              <GamesHub onGameWin={handleMissionSuccess} /> 
            </DashboardLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout title="App" subtitle="Settings">
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<DashboardLayout title="Active" subtitle="Alarms"><Alarm /></DashboardLayout>} />
      </Routes>
    </>
  );
}

// Re-usable layout for consistent UI
function DashboardLayout({ children, title, subtitle }) {
  const { user, explosionMode } = useAuth();
  return (
    <div className="flex h-screen overflow-hidden p-6 gap-6 bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <header className="flex justify-between items-center mb-8 px-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {title} <span className="text-primary">{subtitle}</span>
            </h1>
            <p className="text-slate-500 mt-1 italic">
              {explosionMode ? "EMERGENCY PROTOCOL ACTIVE" : "Defuse to avoid public embarrassment."}
            </p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}