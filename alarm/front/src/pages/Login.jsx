import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setLocalError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 flex items-center justify-center">
      <div className="glass-card w-full max-w-lg p-12 rounded-[2.5rem] relative overflow-hidden animate-in fade-in zoom-in duration-700">
        <div className="absolute -top-24 -right-24 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 size-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-12 relative">
          <div className="size-24 rounded-3xl premium-gradient flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-primary/20 transform hover:rotate-12 transition-transform duration-500">
            <span className="material-symbols-outlined text-6xl">notifications_active</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-3">
            Murgi<span className="text-primary">Klok</span>
          </h1>
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Premium Battle Auth</p>
          </div>
        </div>

        {(localError || error) && (
          <div className="mb-8 p-5 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm font-bold flex items-center gap-4 animate-in slide-in-from-top-4">
            <span className="material-symbols-outlined shrink-0">report</span>
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">fingerprint</span>
              Identity Code
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                alternate_email
              </span>
              <input
                type="text"
                placeholder="admin@gmail.com"
                className="input-field pl-14"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">encrypted</span>
              Battle Password
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                lock
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field pl-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative size-5">
                <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="size-full rounded-md border-2 border-slate-200 dark:border-white/10 peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                <span className="material-symbols-outlined absolute inset-0 text-white text-[14px] flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform">check</span>
              </div>
              <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Remember Terminal</span>
            </label>
            <Link to="/forgot-password" title="Feature coming soon" className="hover:text-primary transition-colors">Lost Code?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 premium-gradient rounded-[1.5rem] font-black shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="animate-spin material-symbols-outlined">progress_activity</span>
            ) : (
              <>
                Initialize Session
                <span className="material-symbols-outlined">east</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 text-center">
          <p className="text-sm font-bold text-slate-400">
            New Recruit? <Link to="/register" className="text-primary hover:text-indigo-400 transition-colors">Apply for Entry</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
