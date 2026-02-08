import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import DayView from "./views/DayView";
import WeekView from "./views/WeekView";
import MonthView from "./views/MonthView";
import YearView from "./views/YearView";
import "./styles/calendar.css";

// background images
import bgLight from "../assets/login/bg-light.png";
import bgNight from "../assets/login/bg-night.png";

export default function CalendarPage() {
  const [view, setView] = useState("month"); // day | week | month | year
  const [currentDate, setCurrentDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  function renderView() {
    switch (view) {
      case "day":
        return <DayView date={currentDate} />;
      case "week":
        return <WeekView date={currentDate} />;
      case "year":
        return <YearView date={currentDate} />;
      default:
        return <MonthView date={currentDate} />;
    }
  }

  return (
    <div
      className={`calendar-page ${darkMode ? "dark" : "light"}`}
      style={{
        backgroundImage: `url(${darkMode ? bgNight : bgLight})`,
      }}
    >
      <div className="calendar-container">
        <CalendarHeader
          view={view}
          setView={setView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="calendar-content">  {renderView()}
        </div>
      </div>
    </div>
  );
}
