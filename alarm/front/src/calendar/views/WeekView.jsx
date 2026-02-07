export default function WeekView({ currentDate }) {
  const startOfWeek = getStartOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="time-col" />
        {days.map((day) => (
          <div key={day.toDateString()} className="day-col-header">
            <div>{day.toLocaleDateString("default", { weekday: "short" })}</div>
            <div className="day-number">{day.getDate()}</div>
          </div>
        ))}
      </div>

      <div className="week-body">
        <div className="time-col">
          {hours.map((h) => (
            <div key={h} className="time-slot">
              {h}:00
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div key={day.toDateString()} className="day-col">
            {hours.map((h) => (
              <div key={h} className="hour-cell" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
