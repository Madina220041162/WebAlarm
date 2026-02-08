import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/login.css";

// background images
import bgLight from "../assets/login/bg-light.png";
import bgNight from "../assets/login/bg-night.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
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
        <h2>Sign In</h2>

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

          <label className="remember">
            <input type="checkbox" /> Remember me
          </label>

          <button type="submit" className="btn primary">
            Login
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
        >
          Login with Google
        </button>

        <button
          className="btn mode"
          onClick={() => setDarkMode(!darkMode)}
        >
          Switch to {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}
