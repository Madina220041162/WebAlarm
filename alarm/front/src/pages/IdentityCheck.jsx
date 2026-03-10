import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function IdentityCheck() {
    const [status, setStatus] = useState("idle"); // idle, scanning, success
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (status === "scanning") {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStatus("success");
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [status]);

    const handleStart = () => {
        setStatus("scanning");
        setProgress(0);
    };

    const handleFinish = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    System <span className="text-primary">Verification</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Align your face with the biometric scanner to defuse.
                </p>
            </div>

            <div className="relative size-80 flex items-center justify-center">
                {/* Outer Ring */}
                <div className={`absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full transition-all duration-700 ${status === 'scanning' ? 'scale-110 opacity-50' : ''}`}></div>

                {/* Scanner Container */}
                <div className="relative size-64 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/5">
                    {status === "idle" && (
                        <span className="material-symbols-outlined text-[10rem] text-slate-200 dark:text-slate-800 animate-pulse">
                            face_6
                        </span>
                    )}

                    {status === "scanning" && (
                        <>
                            {/* Camera Simulation (Gradient/Placeholder) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50"></div>

                            {/* Scanning Bar */}
                            <div
                                className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_#53d22d] z-20 transition-all duration-300 pointer-events-none"
                                style={{ transform: `translateY(${progress * 2.56}px)` }}
                            ></div>

                            {/* Face Icon with Glitch Effect */}
                            <span className="material-symbols-outlined text-[8rem] text-primary/40 animate-pulse transition-all">
                                face_6
                            </span>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-black text-primary drop-shadow-md">
                                    {progress}%
                                </span>
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center space-y-4 animate-in zoom-in spin-in-12 duration-500">
                            <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-6xl">check_circle</span>
                            </div>
                            <span className="text-xl font-black text-primary uppercase tracking-widest">Verified</span>
                        </div>
                    )}
                </div>

                {/* Decorative Corners */}
                <div className="absolute -top-4 -left-4 size-12 border-t-4 border-l-4 border-primary rounded-tl-2xl"></div>
                <div className="absolute -top-4 -right-4 size-12 border-t-4 border-r-4 border-primary rounded-tr-2xl"></div>
                <div className="absolute -bottom-4 -left-4 size-12 border-b-4 border-l-4 border-primary rounded-bl-2xl"></div>
                <div className="absolute -bottom-4 -right-4 size-12 border-b-4 border-r-4 border-primary rounded-br-2xl"></div>
            </div>

            <div className="w-full max-w-xs space-y-4">
                {status === "idle" && (
                    <button
                        onClick={handleStart}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all uppercase tracking-widest"
                    >
                        Start Scan
                    </button>
                )}

                {status === "scanning" && (
                    <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {status === "success" && (
                    <button
                        onClick={handleFinish}
                        className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                    >
                        Access Granted
                    </button>
                )}

                <div className="flex items-center justify-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">AES-256 Biometric Stream</span>
                </div>
            </div>
        </div>
    );
}
