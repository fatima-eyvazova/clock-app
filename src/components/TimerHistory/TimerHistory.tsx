import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "./TimerHistory.scss";

const TimerHistory: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const history = useSelector((state: RootState) => state.timer.history);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="timer-history">
      <div className="timer-history-container">
        <button onClick={toggleHistory} className="toggle-history-btn">
          {showHistory ? "− Hide History" : "+ Show History"}
        </button>
        {showHistory && (
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                {`Started: ${formatTime(entry.startTime)} - Ended: ${formatTime(
                  entry.endTime
                )}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TimerHistory;
