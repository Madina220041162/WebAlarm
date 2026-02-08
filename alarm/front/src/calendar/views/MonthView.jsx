import { useState, useMemo } from "react";

export default function MonthView({ date }) {
  const today = new Date();

  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  const days = [];
  const currentDate = new Date(startDate);
  while (currentDate <= monthEnd) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <div className="month-header">
        {dayNames.map((name) => (
          <div key={name} className="day-header">
            {name}
          </div>
        ))}
      </div>

      <div className="month-grid">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`month-cell ${
              day.getMonth() !== date.getMonth() ? "month-cell-other" : ""
            }`}
          >
            <div className="month-cell-number">{day.getDate()}</div>
            {day.getDate() % 3 === 0 && (
              <div className="month-event">Event {day.getDate()}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
