import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import DayView from "./views/DayView";
import WeekView from "./views/WeekView";
import MonthView from "./views/MonthView";
import YearView from "./views/YearView";

export default function CalendarPage() {
  const [view, setView] = useState("month");
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
    <div className="animate-in fade-in zoom-in duration-500 pb-20">
      <div className="glass-card rounded-xl p-8 min-h-[600px] flex flex-col">
        <CalendarHeader
          view={view}
          setView={setView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          darkMode={false} // Prototype is light-themed/colorful
          setDarkMode={() => { }}
        />

        <div className="flex-1 mt-8">
          {renderView()}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">event_available</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Upcoming</p>
            <p className="font-bold text-slate-800">3 Battles Scheduled</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Status</p>
            <p className="font-bold text-slate-800">Resistance Active</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl flex items-center gap-4">
          <div className="size-12 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
            <span className="material-symbols-outlined">priority_high</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Alert</p>
            <p className="font-bold text-slate-800">Critical Exposure Risk</p>
          </div>
        </div>
      </div>
    </div>
  );
}
