export default function YearView({ date, alarms = [] }) {
  const year = date.getFullYear();
  const today = new Date();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const getMonthDays = (monthIndex) => {
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = new Date(year, monthIndex + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());

    const days = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < 35; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const hasAlarmOnDate = (day) => {
    return alarms.some((alarm) => {
      const alarmDate = new Date(alarm.time);
      return (
        alarmDate.getFullYear() === day.getFullYear() &&
        alarmDate.getMonth() === day.getMonth() &&
        alarmDate.getDate() === day.getDate()
      );
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {monthNames.map((monthName, monthIndex) => {
        const days = getMonthDays(monthIndex);
        
        return (
          <div key={monthIndex} className="bg-white/40 border border-white/60 rounded-2xl p-4 hover:bg-white/60 transition-all">
            <h3 className="text-sm font-black text-slate-900 mb-3 text-center">{monthName}</h3>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-[9px] font-bold text-slate-400 text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, dayIdx) => {
                const isOtherMonth = day.getMonth() !== monthIndex;
                const isToday = day.toDateString() === today.toDateString();
                const hasAlarm = hasAlarmOnDate(day) && !isOtherMonth;

                return (
                  <div
                    key={dayIdx}
                    className={`aspect-square flex items-center justify-center text-[10px] rounded-lg font-semibold transition-all ${
                      isOtherMonth
                        ? "text-slate-300 opacity-40"
                        : isToday
                        ? "bg-primary text-white shadow-md"
                        : hasAlarm
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
