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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md p-10 rounded-xl animate-in font-sans fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="size-20 rounded-3xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-secondary/20">
            <span className="material-symbols-outlined text-5xl">person_add</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recruit<span className="text-secondary">Sign-up</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Establish Identity</p>
        </div>

        {(error || authError) && (
          <div className="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm font-bold">
            ✗ {error || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Username</label>
            <input
              type="text"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-semibold outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Email</label>
            <input
              type="email"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-semibold outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Password</label>
            <input
              type="password"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-semibold outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Repeat Password</label>
            <input
              type="password"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-semibold outline-none"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-secondary to-pink-600 text-white rounded-2xl font-black shadow-xl shadow-secondary/30 hover:shadow-secondary/40 hover:translate-y-[-2px] transition-all"
          >
            {loading ? "Registering..." : "Authorize Identity →"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-secondary">Already a Veteran? Login</Link>
        </div>
      </div>
    </div>
  );
}
