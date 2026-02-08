import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Alarm.css';
import alarmBg from '../assets/alarm-bg.mp4';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Alarm() {
  const [alarms, setAlarms] = useState([]);
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  // Connect to Socket.IO on mount
  useEffect(() => {
    socketRef.current = io(API_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to server via Socket.IO');
    });

    socketRef.current.on('alarmTriggered', (data) => {
      console.log('Alarm triggered:', data);
      playAlarmSound();
      alert(`🔔 Alarm: ${data.label}`);
      // Refresh alarms list to reflect triggered state
      fetchAlarms();
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Fetch alarms on mount
  useEffect(() => {
    fetchAlarms();
  }, []);

  const fetchAlarms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/alarms`);
      const data = await res.json();
      setAlarms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching alarms:', error);
    }
  };

  const playAlarmSound = () => {
    // Simple beep sound using Web Audio API
    if (!audioRef.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    }
  };

  const handleCreateAlarm = async (e) => {
    e.preventDefault();
    if (!time) {
      alert('Please select a time');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/alarms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time: new Date(time).toISOString(),
          label: label || 'Alarm',
        }),
      });

      if (res.ok) {
        setTime('');
        setLabel('');
        fetchAlarms();
      } else {
        alert('Failed to create alarm');
      }
    } catch (error) {
      console.error('Error creating alarm:', error);
      alert('Error creating alarm');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAlarm = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/alarms/${id}/toggle`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchAlarms();
      }
    } catch (error) {
      console.error('Error toggling alarm:', error);
    }
  };

  const handleDeleteAlarm = async (id) => {
    if (window.confirm('Delete this alarm?')) {
      try {
        const res = await fetch(`${API_URL}/api/alarms/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          fetchAlarms();
        }
      } catch (error) {
        console.error('Error deleting alarm:', error);
      }
    }
  };

  return (
    <div className="alarm-container">
      <video className="alarm-bg" autoPlay muted loop playsInline src={alarmBg} />
      <div className="alarm-overlay" />
      <div className="alarm-content">
      <h1>⏰ Alarm Clock</h1>

      <form onSubmit={handleCreateAlarm} className="alarm-form">
        <div className="form-group">
          <label>Time</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Label</label>
          <input
            type="text"
            placeholder="e.g., Wake up"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Alarm'}
        </button>
      </form>

      <div className="alarms-list">
        <h2>Your Alarms ({alarms.length})</h2>
        {alarms.length === 0 ? (
          <p className="empty-state">No alarms set. Create one above!</p>
        ) : (
          <div className="alarms-grid">
            {alarms.map((alarm) => (
              <div
                key={alarm._id}
                className={`alarm-card ${alarm.triggered ? 'triggered' : ''} ${
                  !alarm.enabled ? 'disabled' : ''
                }`}
              >
                <div className="alarm-time">
                  {new Date(alarm.time).toLocaleTimeString()}
                </div>
                <div className="alarm-label">{alarm.label}</div>
                <div className="alarm-date">
                  {new Date(alarm.time).toLocaleDateString()}
                </div>

                <div className="alarm-status">
                  {alarm.triggered ? '✓ Triggered' : alarm.enabled ? 'Enabled' : 'Disabled'}
                </div>

                <div className="alarm-actions">
                  <button
                    onClick={() => handleToggleAlarm(alarm._id)}
                    className={`btn-toggle ${alarm.enabled ? 'enabled' : 'disabled'}`}
                  >
                    {alarm.enabled ? '✓ On' : 'Off'}
                  </button>
                  <button onClick={() => handleDeleteAlarm(alarm._id)} className="btn-delete">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
