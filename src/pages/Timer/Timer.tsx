import React, { useState, useEffect, useRef } from "react";
import "./Timer.scss";

interface TimerHistory {
  duration: string;
  endTime: string;
}

const Timer: React.FC = () => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [history, setHistory] = useState<TimerHistory[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            if (audioRef.current) {
              audioRef.current.play();
            }

            const endTime = new Date().toLocaleString();
            setHistory((prevHistory) => [
              {
                duration: formatTime(hours * 3600 + minutes * 60 + seconds),
                endTime,
              },
              ...prevHistory,
            ]);

            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    } else if (!isActive && remainingTime !== 0) {
      clearInterval(timerRef.current!);
    }
    return () => clearInterval(timerRef.current!);
  }, [isActive, remainingTime]);

  const handleStart = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setRemainingTime(totalSeconds * 1000);
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
    setRemainingTime(0);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="timer">
      <div className="timer-display">{formatTime(remainingTime / 1000)}</div>
      <div className="time-inputs">
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          placeholder="Hours"
          min="0"
        />
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          placeholder="Minutes"
          min="0"
        />
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          placeholder="Seconds"
          min="0"
        />
      </div>
      <div className="timer-buttons">
        <button onClick={handleStart} disabled={isActive}>
          Start
        </button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <audio
        ref={audioRef}
        src="public/sounds/signal-elektronnogo-budilnika-33304.mp3"
        preload="auto"
      />
      <div className="timer-history">
        <h2>Timer History</h2>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              Set for {entry.duration} - Ended at {entry.endTime}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Timer;
