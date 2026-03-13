import { useMemo } from "react";

export default function MonthView({ date, alarms = [], onDateClick }) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  const days = [];
  const currentDate = new Date(startDate);

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
    <div className="flex flex-col h-full flex-1">

      {/* weekday headers */}
      <div className="grid grid-cols-7 mb-4 border-b border-gray-300 dark:border-gray-700 pb-3 text-center">
        {dayNames.map((name) => (
          <div
            key={name}
            className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400"
          >
            {name}
          </div>
        ))}
      </div>

      {/* days grid */}
      <div className="grid grid-cols-7 gap-3 flex-1">
        {days.map((day, idx) => {
          const isOtherMonth = day.getMonth() !== date.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();

          const dayAlarms = getAlarmsForDate(day);

          return (
            <div
              key={idx}
              onClick={() => !isOtherMonth && onDateClick && onDateClick(day)}
              className={`
                min-h-[110px]
                p-3
                rounded-xl
                border
                transition
                duration-200
                flex
                flex-col
                ${
                  isOtherMonth
                    ? "bg-gray-200 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-40"
                    : isToday
                    ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
                    : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                }
              `}
            >

              {/* date number */}
              <div
                className={`text-sm font-bold ${
                  isToday
                    ? "text-white"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {day.getDate()}
              </div>

              {/* alarms */}
              {dayAlarms.slice(0, 2).map((alarm, i) => (
                <div
                  key={alarm._id || i}
                  className={`mt-2 px-2 py-1 rounded text-[10px] font-semibold truncate ${
                    isToday
                      ? "bg-white text-indigo-600"
                      : "bg-indigo-600 text-white"
                  }`}
                  title={alarm.label}
                >
                  {new Date(alarm.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {alarm.label || "Alarm"}
                </div>
              ))}

              {dayAlarms.length > 2 && (
                <div
                  className={`mt-1 text-[10px] font-semibold ${
                    isToday
                      ? "text-white/80"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
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