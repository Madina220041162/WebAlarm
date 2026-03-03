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
      <div className="flex items-center gap-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{monthYear}</h2>
        <div className="flex gap-2">
          <button
            className="size-10 rounded-xl glass-pill flex items-center justify-center text-slate-400 hover:text-primary transition-all"
            onClick={goPrev}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            className="size-10 rounded-xl glass-pill flex items-center justify-center text-slate-400 hover:text-primary transition-all"
            onClick={goNext}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
          <button
            className="px-4 py-2 rounded-xl glass-pill text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary"
            onClick={goToday}
          >
            Today
          </button>
        </div>
      </div>

      <div className="flex p-1.5 bg-slate-100/50 rounded-2xl">
        {["day", "week", "month", "year"].map((v) => (
          <button
            key={v}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === v
                ? "bg-white text-primary shadow-sm"
                : "text-slate-400 hover:text-slate-600"
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
