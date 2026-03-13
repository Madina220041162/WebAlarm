export default function CalendarHeader({
  view,
  setView,
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-6">

        {/* MONTH NAME */}
        <h2 className="text-3xl font-extrabold text-green-700 tracking-tight">
          {monthYear}
        </h2>

        {/* NAVIGATION BUTTONS */}
        <div className="flex gap-2">
          <button
            className="size-10 rounded-xl glass-pill flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-all"
            onClick={goPrev}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <button
            className="size-10 rounded-xl glass-pill flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-all"
            onClick={goNext}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          <button
            className="px-4 py-2 rounded-xl glass-pill text-xs font-black uppercase tracking-widest text-gray-600 hover:text-indigo-500 transition"
            onClick={goToday}
          >
            Today
          </button>
        </div>
      </div>

      {/* VIEW SWITCH */}
      <div className="flex p-1.5 bg-gray-200/70 rounded-2xl">

        {["day", "week", "month", "year"].map((v) => (
          <button
            key={v}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              view === v
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setView(v)}
          >
            {v}
          </button>
        ))}

      </div>
    </div>
  );
}