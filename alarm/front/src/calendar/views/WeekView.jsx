export default function WeekView({ date, alarms = [], onTimeSlotClick }) {
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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM
  const today = new Date();

  const getAlarmsForDayAndHour = (day, hour) => {
    return alarms.filter((alarm) => {
      const alarmDate = new Date(alarm.time);
      return (
        alarmDate.getFullYear() === day.getFullYear() &&
        alarmDate.getMonth() === day.getMonth() &&
        alarmDate.getDate() === day.getDate() &&
        alarmDate.getHours() === hour
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="grid grid-cols-8 gap-2 mb-4 pb-4 border-b border-slate-100">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400"></div>
        {days.map((day, idx) => {
          const isToday = day.toDateString() === today.toDateString();
          return (
            <div key={idx} className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                {dayNames[idx]}
              </div>
              <div className={`text-lg font-black ${isToday ? "bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto" : "text-slate-900"}`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 gap-2">
          <div className="space-y-16">
            {hours.map((hour) => {
              const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
              const period = hour >= 12 ? "PM" : "AM";
              return (
                <div key={hour} className="text-xs font-bold text-slate-400 text-right pr-2">
                  {displayHour} {period}
                </div>
              );
            })}
          </div>

          {days.map((day, dayIdx) => (
            <div key={dayIdx} className="space-y-2">
              {hours.map((hour) => {
                const hourAlarms = getAlarmsForDayAndHour(day, hour);
                const hasAlarms = hourAlarms.length > 0;
                return (
                  <div
                    key={hour}
                    onClick={() => {
                      const clickedDate = new Date(day);
                      clickedDate.setHours(hour, 0, 0, 0);
                      onTimeSlotClick && onTimeSlotClick(clickedDate, `${hour.toString().padStart(2, '0')}:00`);
                    }}
                    className="min-h-[60px] bg-white/40 border border-white/60 rounded-xl p-2 hover:bg-white/60 transition-all cursor-pointer"
                  >
                    {hasAlarms && hourAlarms.map((alarm, i) => (
                      <div key={alarm._id || i} className="bg-primary/10 border-l-2 border-primary rounded px-2 py-1 mb-1">
                        <p className="text-[9px] font-bold text-primary uppercase">
                          {new Date(alarm.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[8px] text-primary truncate">{alarm.label}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
