import React from "react";
import "./LapList.scss";

interface LapItem {
  start: number;
  end: number;
}

interface Props {
  laps: LapItem[];
  time: number;
  isActive: boolean;
  currentLapStart: number;
  onDeleteLap: (index: number) => void;
}

const formatTime = (milliseconds: number) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )},${String(ms).padStart(2, "0")}`;
};

const LapList: React.FC<Props> = ({
  laps,
  time,
  isActive,
  currentLapStart,
  onDeleteLap,
}) => (
  <div className="laps">
    <ul>
      {laps.length &&
        laps.map((lapItem, index) => {
          if (index !== laps.length - 1) {
            return (
              <li key={lapItem.start + " " + lapItem.end}>
                {`Lap ${index + 1} : ${formatTime(
                  Math.max(0, lapItem.end - lapItem.start)
                )}`}
                <button
                  className="delete-lap"
                  onClick={() => onDeleteLap(index)}
                >
                  X
                </button>
              </li>
            );
          }
          return null;
        })}
      {isActive && (
        <li key="current">
          {`Lap ${laps.length || 1} : ${formatTime(time - currentLapStart)}`}
        </li>
      )}
      {!isActive && laps.length && (
        <li
          key={laps[laps.length - 1]?.start + " " + laps[laps.length - 1]?.end}
        >
          {`Lap ${laps.length} : ${formatTime(
            Math.max(
              0,
              laps[laps.length - 1]?.end - laps[laps.length - 1]?.start
            )
          )}`}
          <button
            className="delete-lap"
            onClick={() => onDeleteLap(laps.length - 1)}
          >
            X
          </button>
        </li>
      )}
    </ul>
  </div>
);

export default LapList;
