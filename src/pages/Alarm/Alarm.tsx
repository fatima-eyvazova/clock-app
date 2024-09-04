import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAlarm, toggleAlarm, deleteAlarm } from "../../features/alarmsSlice";
import { RootState } from "../../store";
import "./Alarm.scss";

const Alarm: React.FC = () => {
  const dispatch = useDispatch();
  const alarms = useSelector((state: RootState) => state.alarm.alarms);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [newAlarmTime, setNewAlarmTime] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAddAlarm = () => {
    if (!newAlarmTime) return;
    const id = Date.now();
    dispatch(addAlarm({ id, time: newAlarmTime, isActive: true }));
    setNewAlarmTime("");
    setShowForm(false);
  };

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      alarms.forEach((alarm) => {
        const alarmTime = new Date(`1970-01-01T${alarm.time}:00`);
        if (
          alarm.isActive &&
          now.getHours() === alarmTime.getHours() &&
          now.getMinutes() === alarmTime.getMinutes()
        ) {
          if (audioRef.current) {
            audioRef.current.play();
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 60000);
    return () => clearInterval(interval);
  }, [alarms]);
  const handleToggleAlarm = (id: number) => {
    dispatch(toggleAlarm(id));
  };

  const handleDeleteAlarm = (id: number) => {
    dispatch(deleteAlarm(id));
  };

  return (
    <div className="alarm-container">
      <div className="alarm-header">
        <h2>Alarms</h2>
        <button onClick={() => setShowForm(true)}>+</button>
      </div>
      {showForm && (
        <div className="alarm-form">
          <input
            type="time"
            value={newAlarmTime}
            onChange={(e) => setNewAlarmTime(e.target.value)}
          />
          <button
            onClick={handleAddAlarm}
            className="add-alarm"
            disabled={!newAlarmTime}
          >
            Add Alarm
          </button>
        </div>
      )}
      <ul className="alarm-list">
        {alarms.map((alarm) => (
          <li key={alarm.id} className="alarm-item">
            <div className="alarm-time">{alarm.time}</div>
            <label className="switch">
              <input
                type="checkbox"
                checked={alarm.isActive}
                onChange={() => handleToggleAlarm(alarm.id)}
              />
              <span className="slider"></span>
            </label>
            <button
              onClick={() => handleDeleteAlarm(alarm.id)}
              className="delete-alarm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <audio
        ref={audioRef}
        src="public/sounds/signal-elektronnogo-budilnika-33304.mp3"
        preload="auto"
      />
    </div>
  );
};

export default Alarm;
