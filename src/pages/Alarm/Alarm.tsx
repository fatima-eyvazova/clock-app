import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAlarm, toggleAlarm, deleteAlarm } from "../../features/alarmsSlice";
import { RootState } from "../../store";
import "./Alarm.scss";

const Alarm: React.FC = () => {
  const dispatch = useDispatch();
  const alarms = useSelector((state: RootState) => state.alarm.alarms);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [newAlarmTime, setNewAlarmTime] = useState<string>("");

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
    </div>
  );
};

export default Alarm;
