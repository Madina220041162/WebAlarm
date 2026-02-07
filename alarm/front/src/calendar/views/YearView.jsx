export default function YearView({ currentDate }) {
  const year = currentDate.getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => {
    return new Date(year, i, 1);
  });

  return (
    <div className="year-view">
      <h2>{year}</h2>

      <div className="year-grid">
        {months.map((monthDate) => (
          <MiniMonth key={monthDate.getMonth()} date={monthDate} />
        ))}
      </div>
    </div>
  );
}

function MiniMonth({ date }) {
  const monthName = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="mini-month">
      <div className="mini-month-title">{monthName}</div>

      <div className="mini-weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="mini-days">
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`e-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, d) => (
          <span key={d}>{d + 1}</span>
        ))}
      </div>
    </div>
  );
}
