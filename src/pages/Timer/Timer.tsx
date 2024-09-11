import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setTime, start, stop } from "../../features/timerSlice";
import "./Timer.scss";
import TimerHistory from "../../components/TimerHistory/TimerHistory";
import TimeInputs from "../../components/TimerInputs/TimerInputs";
import TimerButtons from "../../components/TimerButtons/TimerButtons";

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

  const isStartButtonDisabled = () => {
    return time <= 0;
  };

  const isStopButtonDisabled = () => {
    return time <= 0 || !isActive;
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

  return (
    <div className="timer">
      <div className="timer-container">
        {isEditing ? (
          <TimeInputs
            time={time}
            onHoursChange={handleHoursChange}
            onMinutesChange={handleMinutesChange}
            onSecondsChange={handleSecondsChange}
            setIsEditing={setIsEditing}
          />
        ) : (
          <div className="timer-display">
            {isActive || time > 0 ? formatTime(time) : "00:00:00"}
          </div>
        )}
        <TimerButtons
          onStart={handleStart}
          onStop={handleStop}
          isStartDisabled={isStartButtonDisabled()}
          isStopDisabled={isStopButtonDisabled()}
        />
      </div>
      <TimerHistory />
    </div>
  );
};

export default Timer;
