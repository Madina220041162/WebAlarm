let audioContext = null;

function getContext() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function createAlarmSound(type = "rooster") {
  const context = getContext();
  const normalizedType = type.toLowerCase().replace(/\s+/g, '-');

  const soundFiles = {
    "rooster": "/sounds/rooster.mp3",
    "heavy-metal": "/sounds/heavy-metal.mp3",
    "military-trumpet": "/sounds/military-trumpet.mp3",
    "classic-clock": "/sounds/classic-clock.mp3",
    "electronic-beep": "/sounds/electronic-beep.mp3"
  };

  const audioPath = soundFiles[normalizedType] || soundFiles["rooster"];
  let audio = new Audio(audioPath);
  audio.volume = 0.7;
  audio.loop = true;

  // We keep track of these specifically to kill them later
  let oscillator = null;
  let gainNode = null;

  function start() {
    if (context.state === 'suspended') context.resume();

    audio.play().catch(err => {
      console.warn("MP3 Blocked - Starting Beep Oscillator");
      
      // Stop any existing oscillator first to prevent doubling
      if (oscillator) return; 

      oscillator = context.createOscillator();
      gainNode = context.createGain();
      
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(600, context.currentTime);
      gainNode.gain.setValueAtTime(0.2, context.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start();
    });
  }

  function stop() {
    // 1. KILL THE MP3 IMMEDIATELY
    if (audio) {
      audio.pause();
      audio.src = ""; // Force browser to dump the audio stream
      audio.load();
    }

    // 2. KILL THE BEEP (The Oscillator)
    // In your video, this is what stayed playing!
    if (oscillator) {
      try {
        oscillator.stop(); 
        oscillator.disconnect(); // This "pulls the plug"
        if (gainNode) gainNode.disconnect();
      } catch (e) {
        // Already stopped
      } finally {
        oscillator = null;
        gainNode = null;
      }
    }
    console.log("ALARM TERMINATED SUCCESSFULLY");
  }

  return { start, stop };
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

export function showAlarmNotification(label = "Wake up!") {
  if (!("Notification" in window)) return;
  const notify = () => new Notification("Alarm!", { body: label });
  if (Notification.permission === "granted") notify();
  else Notification.requestPermission().then(p => p === "granted" && notify());
}