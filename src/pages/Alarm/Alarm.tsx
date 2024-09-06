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
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAddAlarm = () => {
    if (!newAlarmTime) return;

    const existingAlarm = alarms.find((alarm) => alarm.time === newAlarmTime);

    if (existingAlarm) {
      alert("Alarm for this time already exists.");
      return;
    }

    const id = Date.now();
    dispatch(addAlarm({ id, time: newAlarmTime, isActive: true }));
    setNewAlarmTime("");
    setShowForm(false);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener("play", () => setShowNotification(true));
      audioElement.addEventListener("ended", () => setShowNotification(false));
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("play", () =>
          setShowNotification(true)
        );
        audioElement.removeEventListener("ended", () =>
          setShowNotification(false)
        );
      }
    };
  }, []);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      alarms
        .slice()
        .sort((a, b) => a.time.localeCompare(b.time))
        .forEach((alarm) => {
          const alarmTime = new Date(`1970-01-01T${alarm.time}:00`);
          if (
            alarm.isActive &&
            now.getHours() === alarmTime.getHours() &&
            now.getMinutes() === alarmTime.getMinutes()
          ) {
            if (audioRef.current) {
              audioRef.current.play();
            }
            setShowNotification(true);
            dispatch(toggleAlarm(alarm.id));
          } else if (alarm.isActive) {
            setShowNotification(false);
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
        {alarms
          .slice()
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((alarm) => (
            <li
              key={alarm.id}
              className={`alarm-item ${
                alarm.isActive ? "alarm-active" : "alarm-disabled"
              }`}
            >
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

      {showNotification && (
        <div className="notification">
          <p>⏰ Time's up!</p>
          <button onClick={handleNotificationClose} className="close-button">
            X
          </button>
        </div>
      )}
      <audio
        ref={audioRef}
        src="public/sounds/signal-elektronnogo-budilnika-33304.mp3"
        preload="auto"
      />
    </div>
  );
};

export default Alarm;
