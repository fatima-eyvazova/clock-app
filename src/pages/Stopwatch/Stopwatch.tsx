import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  start,
  stop,
  reset,
  incrementTime,
  addLap,
  deleteLap,
} from "../../features/stopwatchSlice";
import "./Stopwatch.scss";

const Stopwatch: React.FC = () => {
  const dispatch = useDispatch();
  const { time, isActive, laps, currentLapStart } = useSelector(
    (state: RootState) => state.stopwatch
  );

  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      intervalId.current = setInterval(() => {
        dispatch(incrementTime());
      }, 1);
    } else if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [isActive, dispatch]);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )},${String(ms).padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (isActive) {
      dispatch(stop());
    } else {
      dispatch(start());
    }
  };

  const handleResetAddLap = () => {
    if (isActive) {
      dispatch(addLap());
    } else {
      dispatch(reset());
    }
  };

  const handleDeleteLap = (index: number) => {
    dispatch(deleteLap(index));
  };

  const currentDisplayTime = formatTime(time);

  return (
    <div className="stopwatch">
      <div className="display">{currentDisplayTime}</div>
      <div className="controls">
        <button onClick={handleClick} className={isActive ? "stop" : "start"}>
          {isActive ? "Stop" : "Start"}
        </button>
        <button
          onClick={handleResetAddLap}
          className={isActive ? "lap" : "reset"}
          disabled={!isActive && time === 0}
        >
          {isActive ? "Lap" : "Reset"}
        </button>
      </div>
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
                      onClick={() => handleDeleteLap(index)}
                    >
                      X
                    </button>
                  </li>
                );
              }
            })}
          {isActive && (
            <li key="current">
              {`Lap ${laps.length || 1} : ${formatTime(
                time - currentLapStart
              )}`}
            </li>
          )}
          {!isActive && laps.length && (
            <li
              key={
                laps[laps.length - 1]?.start + " " + laps[laps.length - 1]?.end
              }
            >
              {`Lap ${laps.length} : ${formatTime(
                Math.max(
                  0,
                  laps[laps.length - 1]?.end - laps[laps.length - 1]?.start
                )
              )}`}
              <button
                className="delete-lap"
                onClick={() => handleDeleteLap(laps.length - 1)}
              >
                X
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Stopwatch;
