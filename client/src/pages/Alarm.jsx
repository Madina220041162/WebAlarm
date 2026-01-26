import { useState } from 'react'

// Alarm page - manage alarms
export default function Alarm() {
  const [alarms, setAlarms] = useState([])

  return (
    <div>
      <h1>Alarm</h1>
      <p>You have {alarms.length} alarms set.</p>
      <p>Alarm management features will be added here.</p>
    </div>
  )
}