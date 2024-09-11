import React from "react";
import "./TimerButtons.scss";

interface TimerButtonsProps {
  onStart: () => void;
  onStop: () => void;
  isStartDisabled: boolean;
  isStopDisabled: boolean;
}

const TimerButtons: React.FC<TimerButtonsProps> = ({
  onStart,
  onStop,
  isStartDisabled,
  isStopDisabled,
}) => {
  return (
    <div className="timer-buttons">
      <button onClick={onStart} disabled={isStartDisabled}>
        Start
      </button>
      <button className="stop-btn" onClick={onStop} disabled={isStopDisabled}>
        Stop
      </button>
    </div>
  );
};

export default TimerButtons;
