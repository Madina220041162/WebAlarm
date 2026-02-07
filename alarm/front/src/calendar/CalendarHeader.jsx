export default function CalendarHeader({
  currentDate,
  view,
  setView,
  onPrev,
  onNext,
  onToday,
}) {
  const label = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="calendar-header">
      <button onClick={onPrev}>◀</button>

      <strong>{label}</strong>

      <button onClick={onNext}>▶</button>

      <button onClick={onToday}>Today</button>

      <select value={view} onChange={(e) => setView(e.target.value)}>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
    </div>
  );
}
