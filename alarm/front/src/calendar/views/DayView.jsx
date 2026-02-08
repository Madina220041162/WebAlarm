export default function DayView({ date }) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[date.getDay()];
  const dateStr = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const events = [
    { time: "9:00 AM", title: "Morning Meeting" },
    { time: "2:00 PM", title: "Project Review" },
    { time: "4:30 PM", title: "Team Standup" },
  ];

  return (
    <div className="day-container">
      <div className="day-title">
        {dayName}, {dateStr}
      </div>

      <div className="day-timeline">
        {hours.slice(6, 18).map((hour) => {
          const eventAtHour = events.find(
            (e) => e.time === `${hour}:00 AM` || e.time === `${hour}:00 PM`
          );

          return (
            <div key={hour} className="time-block">
              <div className="time-block-time">
                {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? "PM" : "AM"}
              </div>
              {eventAtHour ? (
                <div className="time-block-event">{eventAtHour.title}</div>
              ) : (
                <div className="time-block-event" style={{ opacity: 0.5 }}>
                  No events scheduled
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
