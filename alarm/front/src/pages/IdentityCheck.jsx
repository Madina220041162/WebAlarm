import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import { filesAPI } from "../services/api";

// Required detected frames before verification is accepted (~3 s at 30 fps)
const REQUIRED_FRAMES = 90;

export default function IdentityCheck() {
    const [status, setStatus] = useState("idle"); // idle | requesting | scanning | success | error
    const [progress, setProgress] = useState(0);
    const [faceDetected, setFaceDetected] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [snapshotDataUrl, setSnapshotDataUrl] = useState(null);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const modelRef = useRef(null);
    const streamRef = useRef(null);
    const rafRef = useRef(null);
    const detectedFrames = useRef(0);

    const stopCamera = useCallback(() => {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    }, []);

    // Clean up on unmount
    useEffect(() => () => stopCamera(), [stopCamera]);

    const handleStart = async () => {
        setStatus("requesting");
        setErrorMsg("");
        setProgress(0);
        setFaceDetected(false);
        detectedFrames.current = 0;

        try {
            // Ask for camera
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
            });
            streamRef.current = stream;
            const video = videoRef.current;
            video.srcObject = stream;
            await video.play();

            // Load BlazeFace (tiny ML model — loads once, cached afterwards)
            if (!modelRef.current) {
                modelRef.current = await blazeface.load();
            }

            setStatus("scanning");

            const detect = async () => {
                if (!videoRef.current || videoRef.current.readyState < 2) {
                    rafRef.current = requestAnimationFrame(detect);
                    return;
                }

                const predictions = await modelRef.current.estimateFaces(videoRef.current, false);
                const hasFace = predictions.length > 0;
                setFaceDetected(hasFace);

                // Draw bounding boxes on overlay canvas
                const canvas = canvasRef.current;
                const video = videoRef.current;
                if (canvas && video) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    predictions.forEach(({ topLeft, bottomRight }) => {
                        const [x, y] = topLeft;
                        const [x2, y2] = bottomRight;
                        ctx.strokeStyle = "#53d22d";
                        ctx.lineWidth = 3;
                        ctx.shadowColor = "#53d22d";
                        ctx.shadowBlur = 12;
                        ctx.strokeRect(x, y, x2 - x, y2 - y);
                    });
                }

                if (hasFace) {
                    detectedFrames.current = Math.min(detectedFrames.current + 1, REQUIRED_FRAMES);
                } else {
                    detectedFrames.current = Math.max(detectedFrames.current - 2, 0);
                }

                const p = Math.round((detectedFrames.current / REQUIRED_FRAMES) * 100);
                setProgress(p);

                if (detectedFrames.current >= REQUIRED_FRAMES) {
                    stopCamera();

                    // Capture a snapshot from the video frame
                    const snapCanvas = document.createElement("canvas");
                    const vid = videoRef.current;
                    snapCanvas.width = vid.videoWidth;
                    snapCanvas.height = vid.videoHeight;
                    const snapCtx = snapCanvas.getContext("2d");
                    // Mirror to match what the user was seeing
                    snapCtx.translate(snapCanvas.width, 0);
                    snapCtx.scale(-1, 1);
                    snapCtx.drawImage(vid, 0, 0);
                    const dataUrl = snapCanvas.toDataURL("image/jpeg", 0.9);
                    setSnapshotDataUrl(dataUrl);

                    // Upload to backend so it appears in File Uploads
                    try {
                        setSaving(true);
                        snapCanvas.toBlob(async (blob) => {
                            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                            const file = new File([blob], `identity-scan-${timestamp}.jpg`, { type: "image/jpeg" });
                            await filesAPI.upload(file);
                        }, "image/jpeg", 0.9);
                    } catch (e) {
                        // Upload failure is non-critical — verification still succeeded
                        console.warn("Snapshot upload failed:", e);
                    } finally {
                        setSaving(false);
                    }

                    setStatus("success");
                    return;
                }

                rafRef.current = requestAnimationFrame(detect);
            };

            detect();
        } catch (err) {
            setStatus("error");
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setErrorMsg("Camera access was denied. Please allow camera access and try again.");
            } else if (err.name === "NotFoundError") {
                setErrorMsg("No camera found on this device.");
            } else {
                setErrorMsg(`Camera error: ${err.message}`);
            }
        }
    };

    const handleRetry = () => {
        stopCamera();
        setStatus("idle");
        setProgress(0);
        setFaceDetected(false);
        setSnapshotDataUrl(null);
        detectedFrames.current = 0;
    };

    const handleFinish = () => {
        navigate("/");
    };

    const statusLabel = {
        idle: "Align your face with the biometric scanner to verify.",
        requesting: "Starting camera and loading AI model…",
        scanning: faceDetected ? "Face detected! Hold still to verify…" : "No face detected. Move closer and look at the camera.",
        success: "Identity confirmed. Access granted.",
        error: errorMsg,
    }[status];

    const cornerColor = (status === "scanning" && faceDetected) || status === "success"
        ? "border-primary"
        : status === "scanning"
        ? "border-amber-400"
        : "border-primary";

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4 max-w-sm px-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    System <span className="text-primary">Verification</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{statusLabel}</p>
            </div>

            <div className="relative size-80 flex items-center justify-center">
                {/* Outer pulsing ring */}
                <div className={`absolute inset-0 border-4 rounded-full transition-all duration-700 ${
                    status === "scanning" && faceDetected ? "border-primary scale-110 opacity-80 animate-pulse" :
                    status === "scanning" ? "border-amber-400 scale-105 opacity-60" :
                    status === "success" ? "border-primary scale-110" :
                    "border-slate-200 dark:border-slate-800"
                }`} />

                {/* Camera / scanner box */}
                <div className="relative size-64 rounded-3xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/10">

                    {/* Live webcam feed */}
                    <video
                        ref={videoRef}
                        className={`absolute inset-0 w-full h-full object-cover rounded-3xl ${status === "scanning" ? "block" : "hidden"}`}
                        muted
                        playsInline
                        style={{ transform: "scaleX(-1)" }}
                    />

                    {/* Face bounding-box canvas (mirrored to match video) */}
                    <canvas
                        ref={canvasRef}
                        className={`absolute inset-0 w-full h-full rounded-3xl pointer-events-none ${status === "scanning" ? "block" : "hidden"}`}
                        style={{ transform: "scaleX(-1)" }}
                    />

                    {/* Animated scan line */}
                    {status === "scanning" && (
                        <div
                            className="absolute left-0 w-full h-[3px] bg-primary z-20 pointer-events-none"
                            style={{ boxShadow: "0 0 16px #53d22d", animation: "scanLine 2s linear infinite" }}
                        />
                    )}

                    {/* Status overlays */}
                    {status === "idle" && (
                        <span className="material-symbols-outlined text-[10rem] text-slate-600 animate-pulse">face_6</span>
                    )}

                    {status === "requesting" && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading…</span>
                        </div>
                    )}

                    {status === "scanning" && (
                        <div className="absolute bottom-3 left-3 right-3 z-30">
                            <div className="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                                <span className={`text-sm font-black ${
                                    faceDetected ? "text-primary" : "text-amber-400"
                                }`}>
                                    {faceDetected ? `Verifying… ${progress}%` : "Looking for face…"}
                                </span>
                            </div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center space-y-4 animate-in zoom-in spin-in-12 duration-500 w-full h-full relative">
                            {snapshotDataUrl
                                ? <img src={snapshotDataUrl} alt="Identity scan" className="w-full h-full object-cover rounded-3xl" />
                                : <div className="flex flex-col items-center gap-4">
                                    <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-6xl">check_circle</span>
                                    </div>
                                  </div>
                            }
                            {/* Verified badge overlay */}
                            <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                                <span className="text-sm font-black text-primary uppercase tracking-widest">
                                    {saving ? "Saving…" : "Verified & Saved"}
                                </span>
                            </div>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center gap-4 p-6 text-center">
                            <span className="material-symbols-outlined text-5xl text-red-400">videocam_off</span>
                            <span className="text-xs font-bold text-slate-400">Camera unavailable</span>
                        </div>
                    )}
                </div>

                {/* Decorative Corners */}
                <div className={`absolute -top-4 -left-4 size-12 border-t-4 border-l-4 rounded-tl-2xl transition-colors duration-500 ${cornerColor}`} />
                <div className={`absolute -top-4 -right-4 size-12 border-t-4 border-r-4 rounded-tr-2xl transition-colors duration-500 ${cornerColor}`} />
                <div className={`absolute -bottom-4 -left-4 size-12 border-b-4 border-l-4 rounded-bl-2xl transition-colors duration-500 ${cornerColor}`} />
                <div className={`absolute -bottom-4 -right-4 size-12 border-b-4 border-r-4 rounded-br-2xl transition-colors duration-500 ${cornerColor}`} />
            </div>

            <div className="w-full max-w-xs space-y-4">
                {(status === "idle" || status === "error") && (
                    <button
                        onClick={handleStart}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all uppercase tracking-widest"
                    >
                        {status === "error" ? "Try Again" : "Start Scan"}
                    </button>
                )}

                {status === "scanning" && (
                    <>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Verification</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${
                                        faceDetected ? "bg-primary" : "bg-amber-400"
                                    }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleRetry}
                            className="w-full py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </button>
                    </>
                )}

                {status === "success" && (
                    <div className="space-y-3">
                        <p className="text-center text-xs text-slate-400 font-semibold">
                            Snapshot saved to <span className="text-primary">File Uploads</span>
                        </p>
                        <button
                            onClick={handleFinish}
                            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                        >
                            Access Granted
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Biometric Scan</span>
                </div>
            </div>
        </div>
    );
}
