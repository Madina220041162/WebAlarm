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
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);

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

      {/* HEADER */}
      <div className="grid grid-cols-8 gap-2 mb-4 pb-4 border-b border-gray-300 dark:border-gray-700">

        <div></div>

        {days.map((day, idx) => {
          const isToday = day.toDateString() === today.toDateString();

          return (
            <div key={idx} className="text-center">

              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                {dayNames[idx]}
              </div>

              <div
                className={`text-lg font-bold mx-auto w-8 h-8 flex items-center justify-center rounded-full ${
                  isToday
                    ? "bg-indigo-500 text-white"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {day.getDate()}
              </div>

            </div>
          );
        })}
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto">

        <div className="grid grid-cols-8 gap-2">

          {/* HOURS */}
          <div className="space-y-16">

            {hours.map((hour) => {
              const displayHour =
                hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

              const period = hour >= 12 ? "PM" : "AM";

              return (
                <div
                  key={hour}
                  className="text-xs font-bold text-gray-500 dark:text-gray-400 text-right pr-2"
                >
                  {displayHour} {period}
                </div>
              );
            })}

          </div>

          {/* DAYS */}
          {days.map((day, dayIdx) => (
            <div key={dayIdx} className="space-y-2">

              {hours.map((hour) => {
                const hourAlarms = getAlarmsForDayAndHour(day, hour);

                return (
                  <div
                    key={hour}
                    onClick={() => {
                      const clickedDate = new Date(day);
                      clickedDate.setHours(hour, 0, 0, 0);

                      onTimeSlotClick &&
                        onTimeSlotClick(
                          clickedDate,
                          `${hour.toString().padStart(2, "0")}:00`
                        );
                    }}
                    className="min-h-[60px] bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
                  >

                    {hourAlarms.map((alarm, i) => (

                      <div
                        key={alarm._id || i}
                        className="bg-indigo-500 text-white rounded px-2 py-1 mb-1"
                      >

                        <p className="text-[9px] font-bold uppercase">
                          {new Date(alarm.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        <p className="text-[8px] truncate">
                          {alarm.label}
                        </p>

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