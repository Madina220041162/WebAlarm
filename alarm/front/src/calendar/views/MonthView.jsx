import "../styles/calendar.css";
import { startOfMonthGrid, addDays, isSameDay, isSameMonth } from "../utils/date";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthView({ currentDate }) {
  // First visible day in the month grid (starts on Sunday)
  const gridStart = startOfMonthGrid(currentDate);

  // Build 6 weeks * 7 days = 42 cells (like Google/Outlook calendars)
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  const today = new Date();

  return (
    <div className="month-view">
      {/* Weekday header */}
      <div className="month-weekdays">
        {WEEKDAYS.map((d) => (
          <div key={d} className="weekday">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="month-grid">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, today);

          return (
            <div
              key={day.toISOString()}
              className={[
                "day-cell",
                inMonth ? "" : "outside",
                isToday ? "today" : "",
              ].join(" ")}
            >
              <div className="day-number">{day.getDate()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
