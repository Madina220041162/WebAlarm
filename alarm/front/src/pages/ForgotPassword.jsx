import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

// background images
import bgLight from "../assets/login/bg-light.png";
import bgNight from "../assets/login/bg-night.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
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
        <h2>Reset Password</h2>

        {sent ? (
          <div className="success-message">
            <p style={{ color: "#4a2e14", textAlign: "center", marginBottom: "20px" }}>
              ✓ Reset link sent to your email
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="primary-btn">
              Send reset link
            </button>
          </form>
        )}

        <div className="links">
          <Link to="/login">Back to login</Link>
          <Link to="/register">Create account</Link>
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
