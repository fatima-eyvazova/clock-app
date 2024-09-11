import { Route, Routes } from "react-router-dom";
import WorldClock from "./pages/WorldClock/WorldClock";
import Stopwatch from "./pages/Stopwatch/Stopwatch";
import Timer from "./pages/Timer/Timer";
import Alarm from "./pages/Alarm/Alarm";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "./store";
import { toggleAlarm } from "./features/alarmsSlice";
import AlarmNotification from "./components/AlarmNotification";
import { setTime, stop } from "./features/timerSlice";

interface Props {
  showNotification: boolean;
  setShowNotification: (bool: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  timerRef: React.MutableRefObject<number | null>;
  audioTimerRef: React.RefObject<HTMLAudioElement>;
  setShowTimerNotification: (bool: boolean) => void;
}

const MainRouter = ({
  showNotification,
  setShowNotification,
  audioRef,
  timerRef,
  audioTimerRef,
  setShowTimerNotification,
}: Props) => {
  const dispatch = useDispatch();
  const alarms = useSelector((state: RootState) => state.alarm.alarms);
  const { isActive, time } = useSelector((state: RootState) => state.timer);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  // const intervalRef = useSelector((state) => state.timer.intervalRef);

  const [initialTime, setInitialTime] = useState<number>(time);

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
    const checkAlarms = () => {
      const now = new Date();
      alarms
        .slice()
        .sort((a, b) => a.time.localeCompare(b.time))
        .forEach((alarm) => {
          const alarmTime = new Date(`1970-01-01T${alarm.time}:00`);
          if (
            alarm.isActive &&
            now.getHours() === alarmTime.getHours() &&
            now.getMinutes() === alarmTime.getMinutes()
          ) {
            if (audioRef.current) {
              audioRef.current.play();
            }
            setShowNotification(true);
            dispatch(toggleAlarm(alarm.id));
          } else if (alarm.isActive) {
            setShowNotification(false);
          }
        });
    };
    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  useEffect(() => {
    const audioElement = audioTimerRef.current;

    if (audioElement) {
      audioElement.addEventListener("play", () =>
        setShowTimerNotification(true)
      );
      audioElement.addEventListener("ended", () =>
        setShowTimerNotification(false)
      );
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("play", () =>
          setShowTimerNotification(true)
        );
        audioElement.removeEventListener("ended", () =>
          setShowTimerNotification(false)
        );
      }
    };
  }, []);

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

    return () => {
      clearInterval(timerRef.current!);
    };
  }, [isActive, time, initialTime]);

  return (
    <>
      {showNotification && <AlarmNotification />}
      <Routes>
        <Route path="/world-clock" element={<WorldClock />} />
        <Route path="/stopwatch" element={<Stopwatch />} />
        <Route
          path="/timer"
          element={
            <Timer
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setInitialTime={setInitialTime}
            />
          }
        />
        <Route path="/" element={<Alarm />} />
      </Routes>
    </>
  );
};

export default MainRouter;
