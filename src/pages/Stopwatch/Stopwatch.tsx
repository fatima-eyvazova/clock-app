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
import LapList from "../../components/LapList/LapList";
import { setTime } from "../../features/timerSlice";

const Stopwatch: React.FC = () => {
  const dispatch = useDispatch();
  const { time, isActive, laps, currentLapStart } = useSelector(
    (state: RootState) => state.stopwatch
  );

  const intervalId = useRef<number | null>(null);
  const savedNow = localStorage.getItem("stopwatch-now");

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
  }, [isActive]);

  useEffect(() => {
    if (savedNow) {
      const now = Date.now();
      const savedTime = parseInt(savedNow);
      const timeDiff = now - savedTime;
      dispatch(setTime(time + timeDiff));
      intervalId.current = time + timeDiff;
    }
  }, [savedNow]);

  localStorage.setItem("stopwatch-now", JSON.stringify(Date.now()));

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
      <LapList
        laps={laps}
        time={time}
        isActive={isActive}
        currentLapStart={currentLapStart}
        onDeleteLap={handleDeleteLap}
      />
    </div>
  );
};

export default Stopwatch;
