import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { createAlarmSound, showAlarmNotification } from "../utils/alarmSound";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";

const SCAN_REQUIRED_FRAMES = 90;

export default function AlarmNotification({
  alarm,
  proofChallenge,
  proofVerified,
  onOpenProof,
  onScanVerified,
  onDismiss,
  onSnooze,
}) {
  const [isRinging, setIsRinging] = useState(true);
  const alarmSoundRef = useRef(null);
  const browserNotificationRef = useRef(null);

  // ── Inline face scan state ──────────────────────────────────────────
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState("idle"); // idle | scanning | success | error
  const [scanProgress, setScanProgress] = useState(0);
  const [faceLive, setFaceLive] = useState(false);
  const scanVideoRef = useRef(null);
  const scanCanvasRef = useRef(null);
  const scanModelRef = useRef(null);
  const scanStreamRef = useRef(null);
  const scanRafRef = useRef(null);
  const scanFrames = useRef(0);

  const stopScan = useCallback(() => {
    if (scanRafRef.current) { cancelAnimationFrame(scanRafRef.current); scanRafRef.current = null; }
    if (scanStreamRef.current) { scanStreamRef.current.getTracks().forEach(t => t.stop()); scanStreamRef.current = null; }
  }, []);

  // Stop camera when modal closes
  useEffect(() => () => stopScan(), [stopScan]);

  const startScan = async () => {
    setScanStatus("scanning");
    setScanProgress(0);
    setFaceLive(false);
    scanFrames.current = 0;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      scanStreamRef.current = stream;
      const video = scanVideoRef.current;
      video.srcObject = stream;
      await video.play();
      if (!scanModelRef.current) scanModelRef.current = await blazeface.load();

      const detect = async () => {
        if (!scanVideoRef.current || scanVideoRef.current.readyState < 2) {
          scanRafRef.current = requestAnimationFrame(detect);
          return;
        }
        const preds = await scanModelRef.current.estimateFaces(scanVideoRef.current, false);
        const hasFace = preds.length > 0;
        setFaceLive(hasFace);

        // Draw box
        const canvas = scanCanvasRef.current;
        const vid = scanVideoRef.current;
        if (canvas && vid) {
          canvas.width = vid.videoWidth;
          canvas.height = vid.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          preds.forEach(({ topLeft, bottomRight }) => {
            const [x, y] = topLeft;
            const [x2, y2] = bottomRight;
            ctx.strokeStyle = "#53d22d";
            ctx.lineWidth = 3;
            ctx.shadowColor = "#53d22d";
            ctx.shadowBlur = 10;
            ctx.strokeRect(x, y, x2 - x, y2 - y);
          });
        }

        if (hasFace) scanFrames.current = Math.min(scanFrames.current + 1, SCAN_REQUIRED_FRAMES);
        else scanFrames.current = Math.max(scanFrames.current - 2, 0);

        const p = Math.round((scanFrames.current / SCAN_REQUIRED_FRAMES) * 100);
        setScanProgress(p);

        if (scanFrames.current >= SCAN_REQUIRED_FRAMES) {
          stopScan();
          setScanStatus("success");
          onScanVerified();
          return;
        }
        scanRafRef.current = requestAnimationFrame(detect);
      };
      detect();
    } catch (err) {
      setScanStatus("error");
    }
  };

  const cancelScan = () => {
    stopScan();
    setScanStatus("idle");
    setScanProgress(0);
    setShowScanner(false);
  };

  useEffect(() => {
    if (!alarm) return;

    // Start alarm sound with the selected sound type
    if (isRinging) {
      alarmSoundRef.current = createAlarmSound(alarm.sound || "rooster");
      alarmSoundRef.current.start();

      // Show browser notification
      browserNotificationRef.current = showAlarmNotification(alarm);
    }

    return () => {
      if (alarmSoundRef.current) {
        alarmSoundRef.current.stop();
      }
      if (browserNotificationRef.current) {
        browserNotificationRef.current.close();
      }
    };
  }, [alarm, isRinging]);

  const handleDismiss = () => {
    if (!proofVerified) return;

    setIsRinging(false);
    if (alarmSoundRef.current) {
      alarmSoundRef.current.stop();
    }
    if (browserNotificationRef.current) {
      browserNotificationRef.current.close();
    }
    onDismiss();
  };

  const handleSnooze = () => {
    setIsRinging(false);
    if (alarmSoundRef.current) {
      alarmSoundRef.current.stop();
    }
    if (browserNotificationRef.current) {
      browserNotificationRef.current.close();
    }
    onSnooze();
  };

  if (!alarm) return null;

  console.log("🔔 AlarmNotification rendering with alarm:", alarm);

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300 relative z-[9999]">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center size-24 rounded-full mb-6 ${
            isRinging ? "bg-danger animate-pulse" : "bg-primary"
          }`}>
            <span className="material-symbols-outlined text-6xl text-white">
              {isRinging ? "notifications_active" : "notifications"}
            </span>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {isRinging ? "⏰ ALARM!" : "Alarm Triggered"}
          </h2>
          
          <p className="text-lg font-bold text-slate-600 mb-1">
            {alarm.label || "Wake Up Battle"}
          </p>
          
          <p className="text-sm text-slate-400 font-semibold">
            {new Date(alarm.time).toLocaleString()}
          </p>

          {alarm.sleeperType && (
            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {alarm.sleeperType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {proofChallenge && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Required Proof</p>
              <p className="font-bold text-slate-800">
                Upload a clear photo containing: <span className="text-primary uppercase">{proofChallenge.target}</span>
              </p>
              <p className={`text-xs font-semibold mt-2 ${proofVerified ? "text-emerald-600" : "text-amber-600"}`}>
                {proofVerified ? "Proof accepted. You can dismiss the alarm." : "Proof not verified yet. Dismiss is locked."}
              </p>
            </div>
          )}

          {/* ── Option 1: Upload proof ── */}
          <button
            onClick={onOpenProof}
            className="w-full py-4 px-6 rounded-xl border-2 border-primary/20 text-primary font-bold text-lg hover:bg-primary/5 transition-all"
          >
            Open Upload Proof
          </button>

          {/* ── Option 2: Face scan ── */}
          {!showScanner ? (
            <button
              onClick={() => { setShowScanner(true); startScan(); }}
              className="w-full py-4 px-6 rounded-xl border-2 border-purple-200 text-purple-600 font-bold text-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">face_unlock</span>
              Scan My Face
            </button>
          ) : (
            <div className="rounded-2xl border-2 border-purple-200 overflow-hidden">
              {/* Camera viewport */}
              <div className="relative bg-slate-900" style={{ height: 200 }}>
                <video
                  ref={scanVideoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted playsInline
                  style={{ transform: "scaleX(-1)", display: scanStatus === "scanning" ? "block" : "none" }}
                />
                <canvas
                  ref={scanCanvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ transform: "scaleX(-1)", display: scanStatus === "scanning" ? "block" : "none" }}
                />
                {/* Scan line animation */}
                {scanStatus === "scanning" && (
                  <div
                    className="absolute left-0 w-full h-[3px] bg-primary z-20 pointer-events-none"
                    style={{ boxShadow: "0 0 12px #53d22d", animation: "scanLine 2s linear infinite" }}
                  />
                )}
                {scanStatus === "success" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 gap-2">
                    <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
                    <span className="text-sm font-black text-primary uppercase tracking-widest">Identity Verified!</span>
                  </div>
                )}
                {scanStatus === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 gap-2">
                    <span className="material-symbols-outlined text-4xl text-red-400">videocam_off</span>
                    <span className="text-xs font-bold text-red-400">Camera unavailable</span>
                  </div>
                )}
              </div>
              {/* Progress bar */}
              {scanStatus === "scanning" && (
                <div className="px-4 pt-3 pb-1">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                    <span className={faceLive ? "text-primary" : "text-amber-500"}>
                      {faceLive ? "Face detected — hold still" : "No face detected"}
                    </span>
                    <span className="text-slate-500">{scanProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 rounded-full ${
                        faceLive ? "bg-primary" : "bg-amber-400"
                      }`}
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={cancelScan}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                {scanStatus === "success" ? "Close Scanner" : "Cancel"}
              </button>
            </div>
          )}

          <button
            onClick={handleDismiss}
            disabled={!proofVerified}
            className="w-full py-4 px-6 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Dismiss Alarm
          </button>
          
          <button
            onClick={handleSnooze}
            className="w-full py-4 px-6 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Snooze 5 Minutes
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
            Complete challenge to stop alarm
          </p>
        </div>
      </div>
    </div>
    </div>,
    document.body
  );
}
