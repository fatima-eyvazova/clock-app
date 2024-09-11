import React from "react";
import "./TimezoneDropdown.scss";

interface Props {
  timezones: { name: string; timezone: string }[];
  selectedTimezones: string[];
  onAddClock: (timezone: string) => void;
  onClose: () => void;
}

const TimezoneDropdown: React.FC<Props> = ({
  timezones,
  selectedTimezones,
  onAddClock,
  onClose,
}) => {
  const filteredTimezones = timezones.filter(
    ({ timezone }) => !selectedTimezones.includes(timezone)
  );

  return (
    <div className="dropdown">
      <button className="dropdown-close" onClick={onClose}>
        X
      </button>
      <div className="dropdown-content">
        {filteredTimezones.map(({ name, timezone }, index) => (
          <div
            key={index}
            className="dropdown-item"
            onClick={() => onAddClock(timezone)}
          >
            {name}
          </div>
        ))}
      </div>
      <div className="dropdown-overlay" onClick={onClose}></div>
    </div>
  );
};

export default TimezoneDropdown;
