// Alarm sound generator - supports real audio files with fallback to Web Audio API
export function createAlarmSound(soundType = "rooster") {
  let audio = null;
  let isPlaying = false;
  let intervalId = null;

  // Map sound types to audio file paths
  const soundFiles = {
    "rooster": "/sounds/rooster.mp3",
    "heavy-metal": "/sounds/heavy-metal.mp3",
    "military-trumpet": "/sounds/military-trumpet.mp3",
    "classic-clock": "/sounds/classic-clock.mp3",
    "electronic-beep": "/sounds/electronic-beep.mp3",
  };

  // Try to use real audio file first
  const soundPath = soundFiles[soundType];
  
  function start() {
    if (isPlaying) return;
    isPlaying = true;
    console.log("Playing alarm sound:", soundType);

    // Try to load and play real audio file
    audio = new Audio(soundPath);
    audio.loop = true;
    audio.volume = 0.7;
    
    audio.play().catch((error) => {
      console.warn("Could not play audio file, using fallback sound:", error);
      // Fallback to Web Audio API if file not found
      useFallbackSound();
    });
  }

  function stop() {
    isPlaying = false;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio = null;
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Fallback to Web Audio API generated sounds
  function useFallbackSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const soundPatterns = {
      "rooster": { freq1: 800, freq2: 1000, duration: 0.5, interval: 1000 },
      "heavy-metal": { freq1: 200, freq2: 400, duration: 0.8, interval: 800 },
      "military-trumpet": { freq1: 600, freq2: 900, duration: 0.6, interval: 900 },
      "classic-clock": { freq1: 800, freq2: 800, duration: 0.3, interval: 1000 },
      "electronic-beep": { freq1: 1200, freq2: 1200, duration: 0.2, interval: 500 },
    };

    const pattern = soundPatterns[soundType] || soundPatterns["rooster"];

    function playBeep() {
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator1.frequency.value = pattern.freq1;
      oscillator2.frequency.value = pattern.freq2;
      oscillator1.type = soundType === "heavy-metal" ? "sawtooth" : "sine";
      oscillator2.type = soundType === "military-trumpet" ? "triangle" : "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + pattern.duration);

      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + pattern.duration);
      oscillator2.stop(audioContext.currentTime + pattern.duration);
    }

    // Play immediately
    playBeep();

    // Then play at intervals
    intervalId = setInterval(() => {
      playBeep();
    }, pattern.interval);
  }

  return { start, stop };
}

// Request browser notification permission
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

// Show browser notification
export function showAlarmNotification(alarm) {
  if (Notification.permission === "granted") {
    const notification = new Notification("⏰ Alarm!", {
      body: alarm.label || "Wake Up!",
      icon: "/favicon.ico",
      tag: alarm.id,
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
  return null;
}
