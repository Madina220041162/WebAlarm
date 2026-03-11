import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
    const { user, logout, explosionMode } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="w-72 glass-card rounded-xl flex flex-col justify-between p-8 h-full transition-all duration-300">
            <div className="space-y-10">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl">notifications_active</span>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                            Murgi<span className="text-primary">Klok</span>
                        </h2>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Wake up
                        </span>
                    </div>
                </div>

                <nav className="space-y-3">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold group transition-all duration-300 ${isActive ? "active-pill" : "glass-pill text-slate-700 hover:text-primary dark:text-slate-400"
                            }`
                        }
                    >
                        <span className="material-symbols-outlined text-2xl">notifications_active</span>
                        <span>Alarm Control</span>
                    </NavLink>

                    <NavLink
                        to="/notes"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold group transition-all duration-300 ${isActive ? "active-pill" : "glass-pill text-slate-700 hover:text-primary dark:text-slate-400"
                            }`
                        }
                    >
                        <span className="material-symbols-outlined text-2xl">description</span>
                        <span>Penalty Notes</span>
                    </NavLink>

                    <NavLink
                        to="/calendar"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold group transition-all duration-300 ${isActive ? "active-pill" : "glass-pill text-slate-700 hover:text-primary dark:text-slate-400"
                            }`
                        }
                    >
                        <span className="material-symbols-outlined text-2xl">calendar_month</span>
                        <span>Mission Schedule</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold group transition-all duration-300 ${isActive ? "active-pill" : "glass-pill text-slate-700 hover:text-primary dark:text-slate-400"
                            }`
                        }
                    >
                        <span className="material-symbols-outlined text-2xl">settings</span>
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-3">
                        Threat Severity
                    </p>
                    <div className="flex items-end gap-2 mb-2">
                        <span className={`text-2xl font-black ${explosionMode ? 'text-danger animate-pulse' : 'text-primary'}`}>
                            {explosionMode ? 'CRITICAL' : 'OPTIMAL'}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${explosionMode ? 'bg-gradient-to-r from-danger to-secondary w-full' : 'bg-primary w-1/3'}`}></div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-white/50 dark:border-slate-700">
                    <div className="flex justify-between text-[11px] font-bold uppercase mb-2 text-slate-500">
                        <span>Alarm Volume</span>
                        <span className={explosionMode ? 'text-danger' : 'text-primary'}>
                            {explosionMode ? 'MAXIMIZED' : 'STANDARD'}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-4">
                        <div className={`bg-primary h-full transition-all duration-1000 ${explosionMode ? 'w-full' : 'w-[50%]'}`}></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold uppercase mb-2 text-slate-500">
                        <span>User Patience</span>
                        <span className={explosionMode ? 'text-danger' : 'text-primary'}>
                            {explosionMode ? '0%' : '100%'}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className={`transition-all duration-1000 h-full ${explosionMode ? 'bg-slate-300 w-0' : 'bg-primary w-full'}`}></div>
                    </div>
                </div>

                {user ? (
                    <button
                        onClick={handleLogout}
                        className="w-full py-4 glass-pill text-slate-400 hover:text-danger dark:hover:text-danger font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span>Logout Session</span>
                    </button>
                ) : (
                    <NavLink
                        to="/login"
                        className="w-full py-4 premium-gradient text-white font-black rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                        <span className="material-symbols-outlined mr-2">login</span>
                        Authorized Login
                    </NavLink>
                )}
            </div>
        </aside>
    );
}
