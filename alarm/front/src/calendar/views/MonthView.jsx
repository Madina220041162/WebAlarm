import { useMemo } from "react";

export default function MonthView({ date }) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  const days = [];
  const currentDate = new Date(startDate);
  // Fill 6 weeks to keep grid consistent
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="grid grid-cols-7 mb-4 border-b border-slate-100 pb-4 text-center">
        {dayNames.map((name) => (
          <div key={name} className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3 flex-1">
        {days.map((day, idx) => {
          const isOtherMonth = day.getMonth() !== date.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={idx}
              className={`min-h-[100px] p-4 rounded-2xl border transition-all duration-300 ${isOtherMonth
                  ? "bg-slate-50/30 border-slate-50 opacity-40 grayscale"
                  : isToday
                    ? "bg-primary text-white border-transparent shadow-lg shadow-primary/20 scale-105 z-10"
                    : "bg-white/40 border-white/60 hover:bg-white/60 hover:border-primary/20"
                }`}
            >
              <div className={`text-sm font-black ${isToday ? "text-white" : "text-slate-900"}`}>
                {day.getDate()}
              </div>
              {day.getDate() % 5 === 0 && !isOtherMonth && (
                <div className={`mt-2 px-2 py-1 rounded-lg text-[9px] font-bold uppercase truncate ${isToday ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                  Scheduled Battle
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
