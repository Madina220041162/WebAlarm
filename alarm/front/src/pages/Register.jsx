import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/login.css";

// background images
import bgLight from "../assets/login/bg-light.png";
import bgNight from "../assets/login/bg-night.png";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== repeat) {
      setError("Passwords do not match");
      return;
    }

    register(email, password);
    navigate("/");
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
        <h2>Create Account</h2>

        {error && <p style={{ color: "#c41c3b", textAlign: "center", marginBottom: "12px" }}>✗ {error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Repeat password"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn">
            Create account
          </button>
        </form>

        <div className="links">
          <Link to="/login">Back to login</Link>
        </div>

        <button
          type="button"
          className="primary-btn"
          style={{ marginTop: "10px" }}
          onClick={() => setDarkMode(!darkMode)}
        >
          Switch to {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}
