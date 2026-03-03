import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  const features = [
    {
      icon: "🕐",
      title: "Alarms",
      description: "Set and manage your alarms",
      link: "/alarm",
      color: "#FF6B6B",
      emoji: "⏰",
    },
    {
      icon: "📝",
      title: "Notes",
      description: "Keep your thoughts organized",
      link: "/notes",
      color: "#4ECDC4",
      emoji: "📋",
    },
    {
      icon: "📁",
      title: "Files",
      description: "Manage and upload files",
      link: "/files",
      color: "#95E1D3",
      emoji: "📂",
    },
    {
      icon: "🎮",
      title: "Games",
      description: "Take a break and play",
      link: "/games",
      color: "#FFD93D",
      emoji: "🎯",
    },
    {
      icon: "📅",
      title: "Calendar",
      description: "Plan your schedule",
      link: "/calendar",
      color: "#A8D8EA",
      emoji: "📆",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg">
        {/* Floating decorative elements */}
        <div className="floating-item item-1">📚</div>
        <div className="floating-item item-2">🌱</div>
        <div className="floating-item item-3">🎨</div>
        <div className="floating-item item-4">⭐</div>
        <div className="floating-item item-5">🌟</div>
      </div>

      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome back! 👋</h1>
            <p className="username">{user?.username || "Friend"}</p>
            <p className="subtitle">What would you like to do today?</p>
          </div>
          <div className="welcome-character">
            <div className="character">🤖</div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-box">
            <span className="stat-label">Tasks Today</span>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Alarms Set</span>
            <span className="stat-value">0</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Streak</span>
            <span className="stat-value">0</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-section">
          <h2>Your Features</h2>
          <div className="features-grid">
            {features.map((feature) => (
              <Link to={feature.link} key={feature.title}>
                <div
                  className="feature-card"
                  style={{
                    "--card-color": feature.color,
                  }}
                >
                  <div className="card-icon">{feature.emoji}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="card-arrow">→</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">⏱️</span>
              <span>Start Timer</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">✅</span>
              <span>New Task</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">🔔</span>
              <span>Quick Alarm</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📸</span>
              <span>Add Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
