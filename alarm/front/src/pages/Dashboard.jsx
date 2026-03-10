import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, enterGuestMode } = useAuth();
  const navigate = useNavigate();

  const handleExploreGuest = () => {
    enterGuestMode();
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-4xl">notifications_active</span>
            </div>
          </div>
          <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight">
            Koko<span className="text-primary">Alarm</span>
          </h1>
          <p className="text-xl text-slate-400 mb-4">
            Complete tasks to defeat your alarm. No more sleeping through the day!
          </p>
          <p className="text-sm text-slate-500">
            Solve math problems, take photos, or answer trivia to wake up. The only way to silence the alarm.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">swords</span>
              <h3 className="font-bold text-white text-sm">Battle Modes</h3>
            </div>
            <p className="text-xs text-slate-400">Solve math, take photos, or answer questions</p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
              <h3 className="font-bold text-white text-sm">Schedule Alarms</h3>
            </div>
            <p className="text-xs text-slate-400">Set multiple alarms with custom challenges</p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-2xl">auto_fix_high</span>
              <h3 className="font-bold text-white text-sm">Track Progress</h3>
            </div>
            <p className="text-xs text-slate-400">View statistics and improve your wake-up skills</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 text-center"
              >
                Login to Your Account
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/10 transition-all text-center"
              >
                Create New Account
              </Link>
            </>
          ) : (
            <Link
              to="/alarm"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 text-center"
            >
              Go to Battle Zone
            </Link>
          )}
        </div>

        {/* Guest Access */}
        {!user && (
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-3">Want to explore first?</p>
            <button
              type="button"
              onClick={handleExploreGuest}
              className="text-primary font-semibold hover:text-primary/80 transition-colors text-sm"
            >
              Explore as Guest →
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center border-t border-white/10 pt-8">
          <p className="text-xs text-slate-500">
            KokoAlarm • The Ultimate Wake-Up Challenge
          </p>
        </div>
      </div>
    </div>
  );
}
