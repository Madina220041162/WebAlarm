// GlobalAlarmProvider.jsx
import { useAuth } from "../auth/AuthContext";
import AlarmNotification from "./AlarmNotification";

export default function GlobalAlarmProvider() {
  const { activeAlarmData, alarmProofVerified, handleScanVerified, stopGlobalAlarm, handleSnooze } = useAuth();

  // Only render AlarmNotification if there is an active alarm
  if (!activeAlarmData) return null;

  return (
    <AlarmNotification
      alarm={activeAlarmData}
      proofVerified={alarmProofVerified}
      onScanVerified={handleScanVerified}
      onDismiss={stopGlobalAlarm}
      onSnooze={handleSnooze}
    />
  );
}