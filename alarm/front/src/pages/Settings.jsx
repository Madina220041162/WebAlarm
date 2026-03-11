import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiCall } from "../services/api";

export default function Settings() {
    const {
        user, updateUser,
        theme, toggleTheme,
        explosionMode, toggleExplosionMode
    } = useAuth();

    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email || "");
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await apiCall(
                "/api/auth/profile",
                "PUT",
                { username, email }
            );

            const updatedUser = { ...user, ...res.user };
            updateUser(updatedUser);
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to update profile",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMessage({ type: "error", text: "Passwords do not match" });
        }
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            await apiCall(
                "/api/auth/profile",
                "PUT",
                { password }
            );

            setMessage({ type: "success", text: "Password updated successfully!" });
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to update password",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {message.text && (
                <div
                    className={`px-6 py-4 rounded-2xl font-bold flex items-center gap-3 animate-in zoom-in-95 duration-300 ${message.type === "success"
                        ? "bg-primary/20 text-primary border border-primary/20"
                        : "bg-danger/20 text-danger border border-danger/20"
                        }`}
                >
                    <span className="material-symbols-outlined">
                        {message.type === "success" ? "check_circle" : "error"}
                    </span>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <section className="glass-card rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">person_edit</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Profile Info</h3>
                            <p className="text-xs opacity-60 font-medium">Update your identity</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold text-slate-900 dark:text-white"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold text-slate-900 dark:text-white"
                                placeholder="Enter email"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white font-black uppercase tracking-tight rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Save Profile"}
                        </button>
                    </form>
                </section>

                {/* Security Settings */}
                <section className="glass-card rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined text-2xl">security</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Security</h3>
                            <p className="text-xs opacity-60 font-medium">Manage your credentials</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-semibold text-slate-900 dark:text-white"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-semibold text-slate-900 dark:text-white"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black uppercase tracking-tight rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </section>
            </div>

            {/* App Preferences */}
            <section className="glass-card rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-2xl">tune</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">App Preferences</h3>
                        <p className="text-xs opacity-60 font-medium">Fine-tune your experience</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                        <div>
                            <p className="font-bold">Explosion Mode</p>
                            <p className="text-xs opacity-60">Maximum alarm volume on start</p>
                        </div>
                        <button
                            onClick={toggleExplosionMode}
                            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${explosionMode ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all duration-300 ${explosionMode ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                    <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                        <div>
                            <p className="font-bold">Dark Theme</p>
                            <p className="text-xs opacity-60">Switch between light and dark visual modes</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${theme === 'dark' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all duration-300 ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
