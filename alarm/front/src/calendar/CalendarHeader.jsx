export default function CalendarHeader({
  view,
  setView,
  currentDate,
  setCurrentDate,
  darkMode,
  setDarkMode,
}) {
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function goPrev() {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  }

  function goNext() {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  }

  function goToday() {
    setCurrentDate(new Date());
  }

  return (
    <div className="calendar-header">
      <h2>{monthYear}</h2>

      <button className="calendar-nav-btn" onClick={goPrev}>
        ◀ Previous
      </button>

      <button className="calendar-nav-btn" onClick={goNext}>
        Next ▶
      </button>

      <button className="calendar-nav-btn" onClick={goToday}>
        Today
      </button>

      <div className="calendar-view-controls">
        <button
          className={`view-btn ${view === "day" ? "active" : ""}`}
          onClick={() => setView("day")}
        >
          Day
        </button>
        <button
          className={`view-btn ${view === "week" ? "active" : ""}`}
          onClick={() => setView("week")}
        >
          Week
        </button>
        <button
          className={`view-btn ${view === "month" ? "active" : ""}`}
          onClick={() => setView("month")}
        >
          Month
        </button>
        <button
          className={`view-btn ${view === "year" ? "active" : ""}`}
          onClick={() => setView("year")}
        >
          Year
        </button>
      </div>

      <button
        className="mode-toggle-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        🌙 {darkMode ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
