import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setTime, start, stop } from "../../features/timerSlice";
import "./Timer.scss";
import TimerHistory from "../../components/TimerHistory/TimerHistory";

const Timer: React.FC = () => {
  const dispatch = useDispatch();
  const time = useSelector((state: RootState) => state.timer.time);
  const isActive = useSelector((state: RootState) => state.timer.isActive);
  // const history = useSelector((state: RootState) => state.timer.history);

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [initialTime, setInitialTime] = useState<number>(time);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const savedNow = localStorage.getItem("timer-now");

  useEffect(() => {
    if (isActive && time > 0) {
      timerRef.current = setInterval(() => {
        dispatch(setTime(time - 1000));
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(timerRef.current!);
    }

    if (time <= 0 && isActive) {
      clearInterval(timerRef.current!);
      dispatch(stop());
      setIsEditing(true);
      dispatch(setTime(initialTime));
      if (audioRef.current) {
        audioRef.current.play();
      }
      setShowNotification(true);
    }

    return () => clearInterval(timerRef.current!);
  }, [isActive, time, dispatch, initialTime]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener("play", () => setShowNotification(true));
      audioElement.addEventListener("ended", () => setShowNotification(false));
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("play", () =>
          setShowNotification(true)
        );
        audioElement.removeEventListener("ended", () =>
          setShowNotification(false)
        );
      }
    };
  }, []);

  useEffect(() => {
    if (savedNow) {
      const now = Date.now();
      const savedTime = parseInt(savedNow);
      const timeDiff = now - savedTime;
      console.log({ timeDiff });

      if (time >= timeDiff) {
        dispatch(setTime(Math.floor((time - timeDiff) / 1000)));
      } else {
        dispatch(setTime(0));
        dispatch(stop());
      }

      timerRef.current = Math.floor((time - timeDiff) / 1000);
    }
  }, [savedNow]);

  useEffect(() => {
    return () => {
      localStorage.setItem("timer-now", JSON.stringify(Date.now()));
    };
  }, []);

  const handleStart = () => {
    setIsEditing(false);
    setInitialTime(time);
    dispatch(start());
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    return hours === 0 && minutes === 0 && seconds === 0;
  };

  const isStopButtonDisabled = () => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    return (hours === 0 && minutes === 0 && seconds === 0) || !isActive;
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
          <div className="timer-display">{formatTime(time)}</div>
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
        {showNotification && (
          <div className="notification">
            <p>⏰ Time's up!</p>
            <button onClick={handleNotificationClose} className="close-button">
              X
            </button>
          </div>
        )}
        <audio
          ref={audioRef}
          src="public/sounds/signal-elektronnogo-budilnika-33304.mp3"
          preload="auto"
        />
      </div>
      <TimerHistory />
    </div>
  );
};

export default Timer;
