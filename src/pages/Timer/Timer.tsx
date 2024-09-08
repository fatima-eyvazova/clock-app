import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setTime, start, stop } from "../../features/timerSlice";
import "./Timer.scss";
import TimerHistory from "../../components/TimerHistory/TimerHistory";

interface Props {
  isEditing: boolean;
  setIsEditing: (bool: boolean) => void;
  setInitialTime: (time: number) => void;
}

const Timer: React.FC<Props> = ({
  isEditing,
  setIsEditing,
  setInitialTime,
}) => {
  const dispatch = useDispatch();
  const time = useSelector((state: RootState) => state.timer.time);
  const isActive = useSelector((state: RootState) => state.timer.isActive);

  const handleStart = () => {
    setIsEditing(false);
    setInitialTime(time);
    dispatch(start());
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const isStartButtonDisabled = () => {
    return time <= 0;
  };

  const isStopButtonDisabled = () => {
    return time <= 0 || !isActive;
  };

  const handleStop = () => {
    dispatch(stop());
    setIsEditing(false);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = Number(e.target.value);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const newTime = hours * 3600000 + minutes * 60000 + seconds * 1000;
    dispatch(setTime(newTime));
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Number(e.target.value);
    const seconds = Math.floor((time % 60000) / 1000);
    const newTime = hours * 3600000 + minutes * 60000 + seconds * 1000;
    dispatch(setTime(newTime));
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Number(e.target.value);
    const newTime = hours * 3600000 + minutes * 60000 + seconds * 1000;
    dispatch(setTime(newTime));
  };

  return (
    <div className="timer">
      <div className="timer-container">
        {isEditing ? (
          <div className="time-inputs">
            <div className="time-label">
              <input
                type="number"
                name="hours"
                value={Math.floor(time / 3600000)}
                onFocus={() => setIsEditing(true)}
                onChange={handleHoursChange}
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
                onChange={handleMinutesChange}
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
                onChange={handleSecondsChange}
                placeholder="00"
                min="0"
              />
              <span>seconds</span>
            </div>
          </div>
        ) : (
          <div className="timer-display">
            {isActive || time > 0 ? formatTime(time) : "00:00:00"}
          </div>
        )}
        <div className="timer-buttons">
          <button onClick={handleStart} disabled={isStartButtonDisabled()}>
            Start
          </button>
          <button
            className="stop-btn"
            onClick={handleStop}
            disabled={isStopButtonDisabled()}
          >
            Stop
          </button>
        </div>
      </div>
      <TimerHistory />
    </div>
  );
};

export default Timer;
