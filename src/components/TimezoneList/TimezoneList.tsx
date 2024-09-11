import React from "react";
import "./TimezoneList.scss";

interface Clock {
  city: string;
  time: string;
}

interface Props {
  clocks: Clock[];
  onRemoveClock: (city: string) => void;
}

const TimezoneList: React.FC<Props> = ({ clocks, onRemoveClock }) => {
  return (
    <div className="timezone-list">
      {clocks.map((clock, index) => (
        <div key={index} className="timezone-item">
          <div className="timezone-name">{clock.city}</div>
          <div className="current-time">{clock.time}</div>
          {clock.city !== "Bakı" && (
            <button
              className="delete-button"
              onClick={() => onRemoveClock(clock.city)}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TimezoneList;
