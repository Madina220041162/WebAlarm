export default function YearView({ date }) {
  const year = date.getFullYear();
  const months = [];

  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());

    const days = [];
    const currentDate = new Date(startDate);
    while (currentDate <= monthEnd) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    months.push({
      month: monthStart.toLocaleDateString("en-US", { month: "long" }),
      days: days.slice(0, 35),
    });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="year-grid">
      {months.map((m, idx) => (
        <div key={idx} className="year-month">
          <div className="year-month-name">{monthNames[idx]}</div>
          <div className="year-mini-grid">
            {dayNames.map((d) => (
              <div key={d} style={{ fontWeight: "bold", textAlign: "center" }}>
                {d}
              </div>
            ))}
            {m.days.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className={`year-mini-day ${
                  day.getMonth() !== idx ? "year-mini-day-other" : ""
                } ${day.getDate() % 5 === 0 ? "year-mini-day-has-event" : ""}`}
              >
                {day.getDate()}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
