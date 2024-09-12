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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    max: number
  ) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= max) {
      handler(e);
    }
  };

  const handleHoursChangeFn = () => (e: React.ChangeEvent<HTMLInputElement>) =>
    handleInputChange(e, onHoursChange, 99);
  const handleMinutesChangeFn =
    () => (e: React.ChangeEvent<HTMLInputElement>) =>
      handleInputChange(e, onMinutesChange, 59);
  const handleSecondsChangeFn =
    () => (e: React.ChangeEvent<HTMLInputElement>) =>
      handleInputChange(e, onSecondsChange, 59);

  return (
    <div className="time-inputs">
      <div className="time-label">
        <input
          type="number"
          name="hours"
          value={Math.floor(time / 3600000)}
          onFocus={() => setIsEditing(true)}
          onChange={handleHoursChangeFn()}
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
          onChange={handleMinutesChangeFn()}
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
          onChange={handleSecondsChangeFn()}
          placeholder="00"
          min="0"
        />
        <span>seconds</span>
      </div>
    </div>
  );
};

export default TimeInputs;
