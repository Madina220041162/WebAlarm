import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [alarm, setAlarm] = useState("");
  const [ringing, setRinging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      if (alarm && currentTime === alarm) {
        setRinging(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [alarm]);

  return (
    <div style={styles.wrapper}>
      {/* TIME */}
      <h1 style={styles.time}>
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </h1>

      {/* DATE */}
      <p style={styles.date}>{time.toDateString()}</p>

      {/* ALARM INPUT */}
      <input
        type="time"
        value={alarm}
        onChange={(e) => {
          setAlarm(e.target.value);
          setRinging(false);
        }}
        style={styles.input}
      />

      {/* ALARM STATUS */}
      {alarm && !ringing && (
        <p style={styles.setAlarm}>
          ⏱ Alarm set for <b>{alarm}</b>
        </p>
      )}

      {/* RINGING */}
      {ringing && (
        <p style={styles.alarm}>
          ⏰ ALARM RINGING
        </p>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    textAlign: "center",
  },
  time: {
    fontSize: "96px",
    fontWeight: "600",
    margin: 0,
    color: "#111827",
  },
  date: {
    marginBottom: "24px",
    color: "#374151",
    fontSize: "16px",
  },
  input: {
    fontSize: "16px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #9ca3af",
    background: "rgba(255,255,255,0.9)",
  },
  setAlarm: {
    marginTop: "12px",
    color: "#2563eb",
    fontSize: "14px",
  },
  alarm: {
    marginTop: "16px",
    color: "#dc2626", // 🔴 RED
    fontWeight: "700",
    fontSize: "18px",
    animation: "blink 1s infinite",
  },
};
