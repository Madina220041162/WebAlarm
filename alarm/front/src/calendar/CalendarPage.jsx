import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./views/MonthView";
import DayView from "./views/DayView";
import WeekView from "./views/WeekView";
import YearView from "./views/YearView";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  // ← Previous
  const goPrev = () => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() - 1);
    if (view === "year") d.setFullYear(d.getFullYear() - 1);
    setCurrentDate(d);
  };

  // → Next
  const goNext = () => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() + 1);
    if (view === "year") d.setFullYear(d.getFullYear() + 1);
    setCurrentDate(d);
  };

  // Today
  const goToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        setView={setView}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
      />

      {view === "month" && <MonthView currentDate={currentDate} />}
      {view === "day" && <DayView currentDate={currentDate} />}
      {view === "week" && <WeekView currentDate={currentDate} />}
      {view === "year" && <YearView currentDate={currentDate} />}
    </>
  );
}
