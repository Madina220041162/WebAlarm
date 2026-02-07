import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import DayView from "./views/DayView";
import WeekView from "./views/WeekView";
import MonthView from "./views/MonthView";
import YearView from "./views/YearView";

export default function CalendarPage() {
  const [view, setView] = useState("month"); // day | week | month | year
  const [currentDate, setCurrentDate] = useState(new Date());

  function renderView() {
    switch (view) {
      case "day":
        return <DayView date={currentDate} />;
      case "week":
        return <WeekView date={currentDate} />;
      case "year":
        return <YearView date={currentDate} />;
      default:
        return <MonthView date={currentDate} />;
    }
  }

  return (
    <div>
      <CalendarHeader
        view={view}
        setView={setView}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      {renderView()}
    </div>
  );
}
