import { Routes, Route } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useTheme } from "./theme/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./calendar/CalendarPage";
import Alarm from "./pages/Alarm";
import Notes from "./pages/Notes";
import FileUpload from "./pages/FileUpload";
import GamesHub from "./games/GamesHub";
import Sidebar from "./components/Sidebar";
import "./App.css";

function Navigation() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">🕐 MurgiKlok</div>
      <div className="nav-links">
        <Link to="/">🏠 Home</Link>
        <Link to="/calendar">📅 Calendar</Link>
        <Link to="/alarm">🔔 Alarm</Link>
        <Link to="/notes">📝 Notes</Link>
        <Link to="/files">📁 Files</Link>
        <Link to="/games">🎮 Games</Link>
      </div>
      <div className="nav-user">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <span>{user?.username || user?.email || "User"}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <>
              <Navigation />
              <Dashboard />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <>
              <Navigation />
              <CalendarPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/alarm"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Morning" subtitle="Torture Battle">
              <Alarm />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Roast" subtitle="Vault">
              <Notes />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Secret" subtitle="Files">
              <FileUpload />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/games"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Hall of" subtitle="Shame">
              <GamesHub />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
