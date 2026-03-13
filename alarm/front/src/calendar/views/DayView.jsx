export default function DayView({ date, alarms = [], onTimeSlotClick }) {
  const dayNames = [
    "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
  ];

  const dayName = dayNames[date.getDay()];

  const dateStr = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getAlarmsForHour = (hour) => {
    return alarms.filter((alarm) => {
      const alarmDate = new Date(alarm.time);

      return (
        alarmDate.getFullYear() === date.getFullYear() &&
        alarmDate.getMonth() === date.getMonth() &&
        alarmDate.getDate() === date.getDate() &&
        alarmDate.getHours() === hour
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* header */}
      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-black text-gray-800 dark:text-gray-200">
          {dayName}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
          {dateStr}
        </p>
      </div>

      {/* timeline */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-6 overflow-y-auto">

        <div className="space-y-2">

          {hours.slice(6, 22).map((hour) => {
            const hourAlarms = getAlarmsForHour(hour);

            const displayHour =
              hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

            const period = hour >= 12 ? "PM" : "AM";

            return (
              <div key={hour} className="flex gap-4 group">

                {/* time */}
                <div className="w-20 flex-shrink-0 text-right pt-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {displayHour}:00 {period}
                  </span>
                </div>

                {/* slot */}
                <div
                  className="flex-1 min-h-[60px] border-l-2 border-gray-300 dark:border-gray-700 pl-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                  onClick={() => {
                    const clickedDate = new Date(date);
                    clickedDate.setHours(hour, 0, 0, 0);

                    onTimeSlotClick &&
                      onTimeSlotClick(
                        clickedDate,
                        `${hour.toString().padStart(2, "0")}:00`
                      );
                  }}
                >

                  {hourAlarms.length > 0 ? (

                    <div className="space-y-2">

                      {hourAlarms.map((alarm) => (

                        <div
                          key={alarm._id}
                          className="p-3 rounded-lg bg-indigo-500 text-white shadow-sm"
                        >

                          <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-sm">
                              alarm
                            </span>

                            <span className="font-bold text-sm">
                              {new Date(alarm.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <p className="font-semibold text-sm">
                            {alarm.label || "Alarm"}
                          </p>

                        </div>

                      ))}

                    </div>

                  ) : (

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 font-semibold">
                        + Add alarm
                      </button>
                    </div>

                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}