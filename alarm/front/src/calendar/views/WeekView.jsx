export default function WeekView({ date }) {
  const getWeekStart = (d) => {
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(new Date(date));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="week-grid">
      {days.map((day, idx) => (
        <div key={idx} className="week-day">
          <div className="week-day-header">
            {dayNames[day.getDay()]}
            <br />
            {day.getDate()}/{day.getMonth() + 1}
          </div>
          {hours.slice(6, 18).map((hour) => (
            <div key={hour} className="week-time-slot">
              {hour}:00
              {hour % 3 === 0 && (
                <div className="week-event">Event at {hour}:00</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
