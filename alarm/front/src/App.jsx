import { Routes, Route } from "react-router-dom";
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
import "./App.css";

function DashboardLayout({ children, title, subtitle }) {
  const { user, explosionMode } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden p-6 gap-6 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <header className="flex justify-between items-center mb-8 px-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
              {title || "Morning"} <span className="text-primary">{subtitle || "Dashboard"}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
              {explosionMode ? "EMERGENCY PROTOCOL ACTIVE: Defuse immediately." : "Defuse immediately to avoid scheduled public embarrassment."}
            </p>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="text-right">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user?.username || "Sleepy Visitor"}</p>
              <p className={`text-[9px] uppercase font-black tracking-tighter ${explosionMode ? 'text-danger animate-pulse' : 'text-primary'}`}>
                {explosionMode ? 'Resistance is Futile' : 'At Ease Soldier'}
              </p>
            </div>
            <div className="size-12 rounded-2xl p-0.5 bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/20 group-hover:scale-110 transition-all duration-300">
              <div className="w-full h-full rounded-[0.9rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-slate-400">person</span>
              </div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Publicly Accessible Routes */}
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
            <FileUpload />
          </DashboardLayout>
        }
      />
      <Route
        path="/games"
        element={
          <DashboardLayout title="Wake-up" subtitle="Rankings">
            <GamesHub />
          </DashboardLayout>
        }
      />

      {/* Auth-Required Routes */}
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
      <Route
        path="/identity-check"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Identity" subtitle="Check">
              <IdentityCheck />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <DashboardLayout title="Active" subtitle="Alarms">
            <Alarm />
          </DashboardLayout>
        }
      />
    </Routes >
  );
}
