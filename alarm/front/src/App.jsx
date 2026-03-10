import { Routes, Route } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import GoogleCallback from "./pages/GoogleCallback";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import CalendarPage from "./calendar/CalendarPage";
import Alarm from "./pages/Alarm";
import Notes from "./pages/Notes";
import FileUpload from "./pages/FileUpload";
import GamesHub from "./games/GamesHub";
import Sidebar from "./components/Sidebar";
import "./App.css";

function DashboardLayout({ children, title, subtitle }) {
  return (
    <div className="flex h-screen overflow-hidden p-6 gap-6">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <header className="flex justify-between items-center mb-8 px-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {title || "Morning"} <span className="text-primary">{subtitle || "Dashboard"}</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">
              Defuse immediately to avoid scheduled public embarrassment.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700">Sleepy Civilian</p>
              <p className="text-xs text-danger uppercase font-black tracking-tighter">
                Resistance is Futile
              </p>
            </div>
            <div className="size-12 rounded-2xl p-0.5 bg-gradient-to-tr from-primary to-secondary">
              <img
                alt="Profile"
                className="w-full h-full rounded-[0.9rem] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQzDBvYJeWvZovrleKRpCnQ0eEId1nhNSik1yeaH9Rql8r_uOX6iiz-uWe_9Mq7ZG5rBZwopAZh1emuWEFqFbtlZFofwGHAV0_mo69SOX80wdGRgshOPEeV7hPmRh3XKqvwpQJttavY6wlkyuOdXqs3vZjY4vDZ7ubjdMKJuhDtXj5lyiRcpC3IST8EoO0HodtEc3d5fa_5bvU7ltYzf58WjA3YZO7D-c7cPWQeXgu1nJJmkm4iuGt6YRpbvAXbZlmZEQYaRkmR8zY"
              />
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
      {/* Public non-protected routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/google-callback" element={<GoogleCallback />} />
      <Route path="/explore" element={<Dashboard />} />

      {/* Protected application routes */}
      <Route
        path="/calendar"
        element={
          <ProtectedRoute allowGuest>
            <DashboardLayout title="Events" subtitle="Calendar">
              <CalendarPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/alarm"
        element={
          <ProtectedRoute allowGuest>
            <DashboardLayout title="Morning" subtitle="Torture Battle">
              <Alarm />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute allowGuest>
            <DashboardLayout title="Roast" subtitle="Vault">
              <Notes />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute allowGuest>
            <DashboardLayout title="Secret" subtitle="Files">
              <FileUpload />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/games"
        element={
          <ProtectedRoute allowGuest>
            <DashboardLayout title="Hall of" subtitle="Shame">
              <GamesHub />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback - redirect to dashboard */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}
