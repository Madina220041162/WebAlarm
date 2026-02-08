import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/login.css";

// background images
import bgLight from "../assets/login/bg-light.png";
import bgNight from "../assets/login/bg-night.png";

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setLocalError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`login-page ${darkMode ? "dark" : "light"}`}
      style={{
        backgroundImage: `url(${darkMode ? bgNight : bgLight})`,
      }}
    >
      <div className="login-card">
        <h1 className="title">MurgiKlok</h1>
        <h2>Sign In</h2>

        {(localError || error) && (
          <div className="error-message">{localError || error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <label className="remember">
            <input type="checkbox" disabled={loading} /> Remember me
          </label>

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>

        <hr />

        <button
          className="btn google"
          onClick={() => alert("Google login coming soon")}
          disabled={loading}
        >
          Login with Google
        </button>

        <button
          type="button"
          className="mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
          disabled={loading}
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          title={`Switch to ${darkMode ? "light" : "dark"} mode`}
        >
          <span className="mode-icon" aria-hidden="true">
            {darkMode ? "☀️" : "🌙"}
          </span>
        </button>
      </div>
    </div>
  );
}
