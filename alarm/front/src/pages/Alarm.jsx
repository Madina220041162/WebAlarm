import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { alarmsAPI, getAuthToken } from '../services/api';
import './Alarm.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Alarm() {
  const [alarms, setAlarms] = useState([]);
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');
  const [days, setDays] = useState([]);
  const [soundId, setSoundId] = useState('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const SOUNDS = [
    { id: 'default', name: '🔔 Default Bell' },
    { id: 'alarm1', name: '📢 Alarm 1' },
    { id: 'alarm2', name: '📯 Alarm 2' },
    { id: 'chime', name: '🎵 Chime' },
  ];

  // Connect to Socket.IO on mount
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      auth: {
        token: getAuthToken(),
      },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server via Socket.IO');
    });

    socketRef.current.on('alarmTriggered', (data) => {
      console.log('Alarm triggered:', data);
      playAlarmSound(data.soundId);
      
      // Set active ringing alarm - user must win a game to dismiss it
      const activeAlarm = {
        id: data._id || data.id,
        label: data.label || 'Alarm',
        time: new Date().toISOString(),
      };
      localStorage.setItem('activeRingingAlarm', JSON.stringify(activeAlarm));
      
      setError(`🔔 ALARM! Win a game to stop it: ${data.label}`);
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
      setLoading(true);
      const data = await alarmsAPI.getAll();
      setAlarms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching alarms:', error);
      setError(error.message || 'Error loading alarms');
    } finally {
      setLoading(false);
    }
  };

  const playAlarmSound = (soundType = 'default') => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      let frequency = 800;
      if (soundType === 'alarm1') frequency = 1000;
      if (soundType === 'alarm2') frequency = 600;
      if (soundType === 'chime') frequency = 1200;

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (err) {
      console.error('Error playing sound:', err);
    }
  };

  const handleCreateAlarm = async (e) => {
    e.preventDefault();
    
    if (!time) {
      setError('Please select a time');
      return;
    }

    if (!getAuthToken()) {
      setError('Please login to create alarms');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [hours, minutes] = time.split(':');
      const timeString = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

      const payload = {
        time: timeString,
        label: label || 'Alarm',
        days: days.length > 0 ? days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        soundId: soundId || 'default',
        isEnabled: true,
      };

      console.log('Sending alarm payload:', payload);

      if (editingId) {
        await alarmsAPI.update(editingId, payload);
        setEditingId(null);
      } else {
        await alarmsAPI.create(payload);
      }

      setTime('');
      setLabel('');
      setDays([]);
      setSoundId('default');
      setError('');
      fetchAlarms();
    } catch (error) {
      console.error('Full error creating alarm:', error);
      const errorMessage = error?.message || 'Error creating alarm. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAlarm = async (id) => {
    try {
      await alarmsAPI.toggle(id);
      fetchAlarms();
    } catch (error) {
      console.error('Error toggling alarm:', error);
      setError(error.message || 'Error toggling alarm');
    }
  };

  const handleDeleteAlarm = async (id) => {
    if (!window.confirm('Delete this alarm?')) return;

    try {
      setLoading(true);
      await alarmsAPI.delete(id);
      fetchAlarms();
    } catch (error) {
      console.error('Error deleting alarm:', error);
      setError(error.message || 'Error deleting alarm');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAlarm = (alarm) => {
    setEditingId(alarm._id);
    setLabel(alarm.label);
    setTime(alarm.time);
    setDays(alarm.days || []);
    setSoundId(alarm.soundId || 'default');
  };

  const handleCancel = () => {
    setEditingId(null);
    setTime('');
    setLabel('');
    setDays([]);
    setSoundId('default');
    setError('');
  };

  const toggleDay = (day) => {
    setDays(
      days.includes(day) ? days.filter((d) => d !== day) : [...days, day]
    );
  };

  const formatAlarmTime = (timeString) => {
    // timeString is in HH:MM format
    return timeString;
  };

  return (
    <div className="alarm-container">
      <div className="alarm-content">
        <h1>⏰ Alarm Clock</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleCreateAlarm} className="alarm-form">
          <div className="form-group">
            <label>Time (24-hour format)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Label</label>
            <input
              type="text"
              placeholder="e.g., Wake up, Medication, Meeting"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Repeat Days</label>
            <div className="days-selector">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`day-btn ${days.includes(day) ? 'selected' : ''}`}
                  onClick={() => toggleDay(day)}
                  disabled={loading}
                >
                  {day}
                </button>
              ))}
            </div>
            <small>
              {days.length === 0
                ? 'Select days for recurring alarm'
                : `Repeats: ${days.join(', ')}`}
            </small>
          </div>

          <div className="form-group">
            <label>Sound</label>
            <select
              value={soundId}
              onChange={(e) => setSoundId(e.target.value)}
              disabled={loading}
            >
              {SOUNDS.map((sound) => (
                <option key={sound.id} value={sound.id}>
                  {sound.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-create"
          >
            {loading
              ? 'Creating...'
              : editingId
              ? 'Update Alarm'
              : 'Create Alarm'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="btn-cancel"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="alarms-list">
          <h2>Your Alarms {loading && <span>⏳</span>}</h2>
          {alarms.length === 0 ? (
            <p className="empty-state">
              {loading
                ? 'Loading alarms...'
                : 'No alarms set. Create one above!'}
            </p>
          ) : (
            <div className="alarms-grid">
              {alarms.map((alarm) => (
                <div
                  key={alarm._id}
                  className={`alarm-card ${
                    !alarm.isEnabled ? 'disabled' : ''
                  }`}
                >
                  <div className="alarm-time">
                    {formatAlarmTime(alarm.time)}
                  </div>
                  <div className="alarm-label">{alarm.label}</div>

                  {alarm.days && alarm.days.length > 0 && (
                    <div className="alarm-days">
                      {alarm.days.map((day) => (
                        <span key={day} className="day-badge">
                          {day}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="alarm-sound">
                    🔊{' '}
                    {SOUNDS.find((s) => s.id === alarm.soundId)?.name ||
                      'Default'}
                  </div>

                  <div className="alarm-status">
                    {alarm.isEnabled ? '🟢 Enabled' : '🔴 Disabled'}
                  </div>

                  <div className="alarm-actions">
                    <button
                      onClick={() => handleToggleAlarm(alarm._id)}
                      className={`btn-toggle ${
                        alarm.isEnabled ? 'enabled' : 'disabled'
                      }`}
                      disabled={loading}
                    >
                      {alarm.isEnabled ? '✓ On' : 'Off'}
                    </button>
                    <button
                      onClick={() => handleEditAlarm(alarm)}
                      className="btn-edit"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlarm(alarm._id)}
                      className="btn-delete"
                      disabled={loading}
                    >
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
 