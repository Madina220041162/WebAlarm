import { useEffect, useState } from "react";

export default function DayView({ currentDate }) {
  const [now, setNow] = useState(new Date());

  // update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const isToday =
    currentDate.toDateString() === now.toDateString();

  const minutesFromMidnight =
    now.getHours() * 60 + now.getMinutes();

  const topPosition = (minutesFromMidnight / (24 * 60)) * 100;

  return (
    <div className="day-view">
      {/* Header */}
      <div className="day-header">
        <div className="day-title">
          {currentDate.toLocaleDateString("default", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Body */}
      <div className="day-body">
        <div className="time-col">
          {hours.map((h) => (
            <div key={h} className="time-slot">
              {h}:00
            </div>
          ))}
        </div>

        <div className="day-column">
          {/* current time line */}
          {isToday && (
            <div
              className="now-line"
              style={{ top: `${topPosition}%` }}
            />
          )}

          {hours.map((h) => (
            <div key={h} className="hour-cell" />
          ))}
        </div>
      </div>
    </div>
  );
}
