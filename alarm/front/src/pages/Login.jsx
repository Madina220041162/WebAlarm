import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login, loginWithGoogle, enterGuestMode, error } = useAuth();
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLocalError("");
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setLocalError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestExplore = () => {
    enterGuestMode();
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md p-10 rounded-xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 right-0 p-8">
          <div className="size-20 rounded-full bg-primary/5 blur-3xl"></div>
        </div>

        <div className="text-center mb-10">
          <div className="size-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-5xl">notifications_active</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Murgi<span className="text-primary">Klok</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Premium Battle Auth</p>
        </div>

        {(localError || error) && (
          <div className="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm font-bold flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Identity Code</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400 group-focus-within:text-primary transition-colors">alternate_email</span>
              <input
                type="text"
                placeholder="admin@gmail.com"
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Battle Password</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
              Remember Terminal
            </label>
            <Link to="/forgot-password" title="Feature coming soon" className="hover:text-primary">Lost Code?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:translate-y-[-2px] transition-all disabled:opacity-50"
          >
            {loading ? "Decrypting..." : "Initialize Session →"}
          </button>
        </form>

        <div className="my-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">OR</div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={true}
          title="Google OAuth credentials not yet configured. Use username/password to login."
          className="w-full py-4 mb-4 border border-slate-200 bg-slate-50 rounded-2xl font-bold text-slate-500 cursor-not-allowed flex items-center justify-center gap-3 opacity-50"
        >
          <span className="text-base">G</span>
          Sign in with Google (Coming Soon)
        </button>

        <button
          type="button"
          onClick={handleGuestExplore}
          disabled={loading}
          className="w-full py-3 rounded-2xl font-bold text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
        >
          Continue as Guest
        </button>

        <div className="mt-10 pt-10 border-t border-slate-100 text-center">
          <p className="text-sm font-bold text-slate-400">
            New Recruit? <Link to="/register" className="text-primary hover:underline">Apply for Entry</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
