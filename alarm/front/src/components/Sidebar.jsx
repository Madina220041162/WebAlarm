import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
    const { user, isGuest, logout } = useAuth();

    return (
        <aside className="w-72 glass-card rounded-xl flex flex-col justify-between p-8 h-full">
            <div className="space-y-10">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl">notifications_active</span>
                    </div>
                    <div>
                        <h2 className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                            Koko<span className="text-primary">Alarm</span>
                        </h2>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Battle Premium
                        </span>
                    </div>
                </Link>

                {user || isGuest ? (
                    <nav className="space-y-3">
                        <NavLink
                            to="/calendar"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold group transition-all duration-300 ${isActive ? "active-pill" : "glass-pill text-slate-500 hover:text-primary"
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-2xl">calendar_month</span>
                            <span>Calendar</span>
                        </NavLink>

                        <NavLink
                            to="/alarm"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold group transition-all duration-300 ${isActive ? "active-pill" : "glass-pill text-slate-500 hover:text-primary"
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-2xl">swords</span>
                            <span>Battle Zone</span>
                        </NavLink>

                        <NavLink
                            to="/notes"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold group transition-all duration-300 ${isActive ? "active-pill" : "glass-pill text-slate-500 hover:text-primary"
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-2xl">auto_fix_high</span>
                            <span>The Roast Vault</span>
                        </NavLink>

                        <NavLink
                            to="/games"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold group transition-all duration-300 ${isActive ? "active-pill" : "glass-pill text-slate-500 hover:text-primary"
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-2xl">history</span>
                            <span>Hall of Shame</span>
                        </NavLink>

                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold group transition-all duration-300 ${isActive ? "active-pill" : "glass-pill text-slate-500 hover:text-primary"
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-2xl">settings</span>
                            <span>Settings</span>
                        </NavLink>
                    </nav>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-slate-500 font-semibold px-2">Welcome to KokoAlarm!</p>
                        <p className="text-xs text-slate-400 px-2">Login or create an account to start your battle</p>
                    </div>
                )}

                <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-3">
                        Threat Severity
                    </p>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-2xl font-black text-danger">CRITICAL</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-danger to-secondary h-full w-full"></div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white/50 p-5 rounded-2xl border border-white/50">
                    <div className="flex justify-between text-[11px] font-bold uppercase mb-2 text-slate-500">
                        <span>Alarm Volume</span>
                        <span className="text-danger">Maximized</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-4">
                        <div className="bg-primary h-full w-[100%]"></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold uppercase mb-2 text-slate-500">
                        <span>User Patience</span>
                        <span className="text-danger">0%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-slate-300 h-full w-0"></div>
                    </div>
                </div>

                {user || isGuest ? (
                    <div className="bg-white/50 p-5 rounded-2xl border border-white/50">
                        <div className="flex items-center gap-3 p-2 mb-2">
                            <div className="size-10 rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5">
                                <img
                                    alt="Profile"
                                    className="w-full h-full rounded-[0.7rem] object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQzDBvYJeWvZovrleKRpCnQ0eEId1nhNSik1yeaH9Rql8r_uOX6iiz-uWe_9Mq7ZG5rBZwopAZh1emuWEFqFbtlZFofwGHAV0_mo69SOX80wdGRgshOPEeV7hPmRh3XKqvwpQJttavY6wlkyuOdXqs3vZjY4vDZ7ubjdMKJuhDtXj5lyiRcpC3IST8EoO0HodtEc3d5fa_5bvU7ltYzf58WjA3YZO7D-c7cPWQeXgu1nJJmkm4iuGt6YRpbvAXbZlmZEQYaRkmR8zY"
                                />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-slate-700 truncate">
                                    {isGuest ? "Guest Explorer" : user?.username || "Sleepy Civilian"}
                                </p>
                                <p className="text-[9px] text-danger uppercase font-black tracking-tighter">
                                    {isGuest ? "Login For Full Access" : "Resistance is Futile"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full py-4 glass-pill text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:text-danger transition-colors"
                        >
                            <span className="material-symbols-outlined">lock_open</span>
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Link
                            to="/login"
                            className="w-full py-4 glass-pill text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">login</span>
                            <span>Login</span>
                        </Link>
                        <Link
                            to="/register"
                            className="w-full py-4 glass-pill text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">person_add</span>
                            <span>Sign Up</span>
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
}
