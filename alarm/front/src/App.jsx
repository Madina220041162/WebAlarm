import React, { useState } from "react";
import Clock from "./components/Clock";
import CalendarPage from "./calendar/CalendarPage";
import Alarm from "./components/Alarm";
import SoundPicker from "./components/SoundPicker";
import Notes from "./pages/Notes";
import FileUpload from "./pages/FileUpload";
import GamesHub from "./games/GamesHub";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="container">
      {/* LEFT */}
      <div className="left">
        <video autoPlay loop muted>
          <source src="/light.mp4" type="video/mp4" />
        </video>
      </div>

      {/* RIGHT */}
      <div className="right">
        {/* floating balls */}
        <ul className="particles">
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
        </ul>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            🕐 Home
          </button>
          <button 
            className={`tab-btn ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            📅 Calendar & Alarm
          </button>
          <button 
            className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            📝 Notes
          </button>
          <button 
            className={`tab-btn ${activeTab === "files" ? "active" : ""}`}
            onClick={() => setActiveTab("files")}
          >
            📁 Files
          </button>
          <button 
            className={`tab-btn ${activeTab === "games" ? "active" : ""}`}
            onClick={() => setActiveTab("games")}
          >
            🎮 Games
          </button>
        </div>

        {/* Content */}
        <div className="content">
          {activeTab === "home" && (
            <>
              <Clock />
              <SoundPicker />
            </>
          )}
          
          {activeTab === "calendar" && <CalendarPage />}
          {activeTab === "calendar" && <Alarm />}
          
          {activeTab === "notes" && <Notes />}
          
          {activeTab === "files" && <FileUpload />}
          
          {activeTab === "games" && <GamesHub />}
        </div>
      </div>
    </div>
  );
}

export default App;
