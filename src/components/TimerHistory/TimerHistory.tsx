import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import "./TimerHistory.scss";
import { clearHistory } from "../../features/timerSlice";

const TimerHistory: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const dispatch = useDispatch();

  const history = useSelector((state: RootState) => state.timer.history);

  const formatTime = (milliseconds: number) => {
    if (milliseconds < 0) milliseconds = 0;

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
  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  return (
    <div className="timer-history">
      <div className="timer-history-container">
        <button onClick={toggleHistory} className="toggle-history-btn">
          {showHistory ? "− Hide History" : "+ Show History"}
        </button>
        {showHistory && (
          <>
            <ul>
              {history.map((entry, index) => (
                <li key={index}>
                  {`Started: ${formatTime(
                    entry.startTime
                  )} - Ended: ${formatTime(entry.endTime)}`}
                </li>
              ))}
            </ul>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="clear-history-btn"
              >
                Clear History
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TimerHistory;
