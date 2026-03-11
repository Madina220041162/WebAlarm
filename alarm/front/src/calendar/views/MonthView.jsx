import { useMemo } from "react";

export default function MonthView({ date, alarms = [], onDateClick }) {
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

  const getAlarmsForDate = (day) => {
    return alarms.filter((alarm) => {
      const alarmDate = new Date(alarm.time);
      return (
        alarmDate.getFullYear() === day.getFullYear() &&
        alarmDate.getMonth() === day.getMonth() &&
        alarmDate.getDate() === day.getDate()
      );
    });
  };

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
          const dayAlarms = getAlarmsForDate(day);
          const hasAlarms = dayAlarms.length > 0;

          return (
            <div
              key={idx}
              onClick={() => !isOtherMonth && onDateClick && onDateClick(day)}
              className={`min-h-[100px] p-4 rounded-2xl border transition-all duration-300 ${
                !isOtherMonth ? "cursor-pointer" : ""
              } ${isOtherMonth
                  ? "bg-slate-50/30 border-slate-50 opacity-40 grayscale"
                  : isToday
                    ? "bg-primary text-white border-transparent shadow-lg shadow-primary/20 scale-105 z-10"
                    : "bg-white/40 border-white/60 hover:bg-white/60 hover:border-primary/20"
                }`}
            >
              <div className={`text-sm font-black ${isToday ? "text-white" : "text-slate-900"}`}>
                {day.getDate()}
              </div>
              {hasAlarms && !isOtherMonth && dayAlarms.slice(0, 2).map((alarm, i) => (
                <div
                  key={alarm._id || i}
                  className={`mt-2 px-2 py-1 rounded-lg text-[9px] font-bold uppercase truncate ${
                    isToday ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                  }`}
                  title={alarm.label}
                >
                  {new Date(alarm.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {alarm.label || "Alarm"}
                </div>
              ))}
              {dayAlarms.length > 2 && (
                <div className={`mt-1 text-[8px] font-bold ${isToday ? "text-white/70" : "text-slate-400"}`}>
                  +{dayAlarms.length - 2} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
