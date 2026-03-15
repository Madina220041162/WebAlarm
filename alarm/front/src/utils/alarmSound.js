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

  async function start() {
    if (context.state === 'suspended') context.resume();

    try {
      await audio.play();
      return true;
    } catch (err) {
      console.warn("Alarm sound playback failed. No fallback beep will be started.", err?.message || err);
      return false;
    }
  }

  function stop() {
    // 1. KILL THE MP3 IMMEDIATELY
    if (audio) {
      audio.pause();
      audio.src = ""; // Force browser to dump the audio stream
      audio.load();
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