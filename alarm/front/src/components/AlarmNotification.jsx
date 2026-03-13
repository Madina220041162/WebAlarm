import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { createAlarmSound } from "../utils/alarmSound";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";

const SCAN_REQUIRED_FRAMES = 90;

export default function AlarmNotification({
  alarm,
  proofVerified,
  onScanVerified,
  onDismiss,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const alarmSoundRef = useRef(null);

  // Mission States
  const [activeMission, setActiveMission] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const [scanProgress, setScanProgress] = useState(0);

  // Scanner Refs
  const scanVideoRef = useRef(null);
  const scanModelRef = useRef(null);
  const scanStreamRef = useRef(null);
  const scanRafRef = useRef(null);
  const scanFrames = useRef(0);

  // 1. GLOBAL AUDIO CONTROL: The "Kill Switch"
  useEffect(() => {
    // If proof is verified (from Face, Game, or Vault Upload), KILL sound immediately
    if (proofVerified) {
      if (alarmSoundRef.current) {
        console.log("ALARM STOPPED: Proof Verified via Mission.");
        alarmSoundRef.current.stop();
        alarmSoundRef.current = null;
      }
      return;
    }

    // Start sound if it's not already playing
    if (alarm && !alarmSoundRef.current) {
      alarmSoundRef.current = createAlarmSound(alarm.sound || "rooster");
      alarmSoundRef.current.start();
    }

    // Cleanup when component unmounts
    return () => {
      if (alarmSoundRef.current) {
        alarmSoundRef.current.stop();
        alarmSoundRef.current = null;
      }
    };
  }, [alarm, proofVerified]);

  // 2. Inject CSS for scan animations
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scanLine { 0% { top: 0%; } 100% { top: 100%; } }
      .mirror { transform: scaleX(-1); }
      .glow-red { box-shadow: 0 0 30px rgba(220, 38, 38, 0.6); }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const stopScan = useCallback(() => {
    if (scanRafRef.current) cancelAnimationFrame(scanRafRef.current);
    if (scanStreamRef.current) {
      scanStreamRef.current.getTracks().forEach((t) => t.stop());
    }
  }, []);

  // Logic for the Biometric Face Scan
  const startScan = async () => {
    setScanStatus("scanning");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      scanStreamRef.current = stream;
      if (scanVideoRef.current) {
        scanVideoRef.current.srcObject = stream;
        await scanVideoRef.current.play();
      }
      if (!scanModelRef.current) scanModelRef.current = await blazeface.load();

      const detect = async () => {
        if (!scanVideoRef.current) return;
        const preds = await scanModelRef.current.estimateFaces(scanVideoRef.current, false);
        const hasFace = preds.length > 0;
        
        if (hasFace) scanFrames.current++;
        else scanFrames.current = Math.max(0, scanFrames.current - 2);

        const progress = Math.min(100, Math.round((scanFrames.current / SCAN_REQUIRED_FRAMES) * 100));
        setScanProgress(progress);

        if (scanFrames.current >= SCAN_REQUIRED_FRAMES) {
          stopScan();
          setScanStatus("success");
          onScanVerified(); // Triggers global proofVerified = true
          onDismiss();      // Closes modal
          return;
        }
        scanRafRef.current = requestAnimationFrame(detect);
      };
      detect();
    } catch (err) { 
      setScanStatus("error"); 
    }
  };

  if (!alarm) return null;

  // Logic to hide the main modal UI when the user is actually doing a mission
  const isCurrentlyWorking = location.pathname === "/games" || location.pathname === "/files";

  return createPortal(
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${isCurrentlyWorking && !proofVerified ? 'pointer-events-none' : 'bg-slate-950/95 backdrop-blur-2xl'}`}>
      
      {/* Mini-Indicator for "Mission Mode" */}
      {isCurrentlyWorking && !proofVerified ? (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-black animate-bounce shadow-xl flex items-center gap-2 pointer-events-auto">
          <span className="material-symbols-outlined animate-spin">priority_high</span>
          ALARM ACTIVE: COMPLETE MISSION
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-8 relative border-4 border-slate-100 overflow-hidden pointer-events-auto">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center size-24 rounded-full mb-4 shadow-2xl transition-all duration-700 ${
              proofVerified ? "bg-emerald-500 scale-110 shadow-emerald-200" : "bg-red-600 animate-pulse glow-red"
            }`}>
              <span className="material-symbols-outlined text-5xl text-white">
                {proofVerified ? "verified_user" : "emergency_home"}
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              {proofVerified ? "Mission Cleared" : "Mission Pending"}
            </h2>
          </div>

          <div className="space-y-4">
            {!proofVerified && activeMission !== 'face' && (
              <div className="grid gap-3">
                {/* 1. Games Mission */}
                <button 
                  onClick={() => navigate("/games")} 
                  className="w-full py-5 px-6 rounded-2xl bg-orange-500 text-white font-black text-lg hover:bg-orange-600 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl">videogame_asset</span>
                    <span>NEURAL CHALLENGE</span>
                  </div>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                </button>

                {/* 2. Object Verification Mission */}
                <button 
                  onClick={() => navigate("/files")} 
                  className="w-full py-5 px-6 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl">inventory_2</span>
                    <span>VAULT STORAGE</span>
                  </div>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                </button>

                {/* 3. Face Scan Mission */}
                <button 
                  onClick={() => { setActiveMission('face'); startScan(); }} 
                  className="w-full py-5 px-6 rounded-2xl border-4 border-slate-900 text-slate-900 font-black text-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl">face</span>
                    <span>BIOMETRIC SCAN</span>
                  </div>
                  <span className="material-symbols-outlined">scan</span>
                </button>
              </div>
            )}

            {/* Face Scan UI */}
            {!proofVerified && activeMission === 'face' && (
               <div className="rounded-3xl border-4 border-slate-900 overflow-hidden bg-black relative">
                 <video ref={scanVideoRef} className="w-full h-64 object-cover mirror" muted playsInline />
                 <div className="absolute bottom-0 w-full p-4 bg-slate-900/90">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-cyan-400" style={{ width: `${scanProgress}%` }} />
                    </div>
                 </div>
                 <button onClick={() => { stopScan(); setActiveMission(null); }} className="absolute top-4 right-4 text-white">
                   <span className="material-symbols-outlined">close</span>
                 </button>
               </div>
            )}

            <div className="pt-6">
              <button
                onClick={onDismiss}
                disabled={!proofVerified}
                className={`w-full py-6 rounded-[2rem] font-black text-2xl transition-all uppercase flex items-center justify-center gap-3 ${
                  proofVerified ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-300"
                }`}
              >
                {proofVerified ? "Silence Alarm" : "Locked"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}