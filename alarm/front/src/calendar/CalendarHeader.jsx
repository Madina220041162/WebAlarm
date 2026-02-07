export default function CalendarHeader({
  currentDate,
  setCurrentDate,
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      <button onClick={goPrev}>◀</button>

      <div style={{ fontSize: "20px", fontWeight: 600 }}>
        {monthYear}
      </div>

      <button onClick={goNext}>▶</button>

      <button onClick={goToday}>Today</button>
    </div>
  );
}
