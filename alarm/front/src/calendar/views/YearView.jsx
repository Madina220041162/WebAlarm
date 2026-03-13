export default function YearView({ date, alarms = [] }) {
  const year = date.getFullYear();
  const today = new Date();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const dayNames = ["S","M","T","W","T","F","S"];

  const getMonthDays = (monthIndex) => {
    const monthStart = new Date(year, monthIndex, 1);
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
          <div
            key={monthIndex}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-4 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >

            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 text-center">
              {monthName}
            </h3>

            <div className="grid grid-cols-7 gap-1 mb-2">

              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-[9px] font-bold text-gray-500 dark:text-gray-400 text-center"
                >
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
                    className={`aspect-square flex items-center justify-center text-[10px] rounded-lg font-semibold transition ${
                      isOtherMonth
                        ? "text-gray-400 opacity-40"
                        : isToday
                        ? "bg-indigo-500 text-white"
                        : hasAlarm
                        ? "bg-indigo-200 dark:bg-indigo-700 text-indigo-800 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
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