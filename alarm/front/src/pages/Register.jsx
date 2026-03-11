import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== repeat) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password too short"); return; }
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 flex items-center justify-center">
      <div className="glass-card w-full max-w-lg p-12 rounded-[2.5rem] relative overflow-hidden animate-in fade-in zoom-in duration-700">
        <div className="absolute -top-24 -right-24 size-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-12 relative">
          <div className="size-24 rounded-3xl premium-gradient flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-primary/20 transform hover:rotate-12 transition-transform duration-500">
            <span className="material-symbols-outlined text-6xl">person_add</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-3">
            Recruit<span className="text-indigo-500">Sign-up</span>
          </h1>
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Establish Identity</p>
          </div>
        </div>

        {(error || authError) && (
          <div className="mb-8 p-5 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm font-bold flex items-center gap-4 animate-in slide-in-from-top-4">
            <span className="material-symbols-outlined shrink-0">report_gmailerrorred</span>
            {error || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Username</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="e.g. CommanderZin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="recruit@command.hq"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Password</label>
              <input
                type="password"
                className="input-field px-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Verify</label>
              <input
                type="password"
                className="input-field px-4"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 premium-gradient rounded-3xl font-black shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <span className="animate-spin material-symbols-outlined">progress_activity</span>
            ) : (
              <>
                Authorize Identity
                <span className="material-symbols-outlined">verified</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors">Already a Veteran? Login</Link>
        </div>
      </div>
    </div>
  );
}
