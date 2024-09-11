import React from "react";
import "./TimerInputs.scss";

interface TimeInputsProps {
  time: number;
  onHoursChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMinutesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSecondsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsEditing: (bool: boolean) => void;
}

const TimeInputs: React.FC<TimeInputsProps> = ({
  time,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
  setIsEditing,
}) => {
  return (
    <div className="time-inputs">
      <div className="time-label">
        <input
          type="number"
          name="hours"
          value={Math.floor(time / 3600000)}
          onFocus={() => setIsEditing(true)}
          onChange={onHoursChange}
          placeholder="00"
          min="0"
        />
        <span>hours</span>
      </div>
      <div className="time-label">
        <input
          type="number"
          name="minutes"
          value={Math.floor((time % 3600000) / 60000)}
          onFocus={() => setIsEditing(true)}
          onChange={onMinutesChange}
          placeholder="00"
          min="0"
        />
        <span>minutes</span>
      </div>
      <div className="time-label">
        <input
          type="number"
          name="seconds"
          value={Math.floor((time % 60000) / 1000)}
          onFocus={() => setIsEditing(true)}
          onChange={onSecondsChange}
          placeholder="00"
          min="0"
        />
        <span>seconds</span>
      </div>
    </div>
  );
};

export default TimeInputs;
