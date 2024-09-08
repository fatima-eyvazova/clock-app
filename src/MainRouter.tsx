import { Route, Routes } from "react-router-dom";
import WorldClock from "./pages/WorldClock/WorldClock";
import Stopwatch from "./pages/Stopwatch/Stopwatch";
import Timer from "./pages/Timer/Timer";
import Alarm from "./pages/Alarm/Alarm";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "./store";
import { toggleAlarm } from "./features/alarmsSlice";

interface Props {
  showNotification: boolean;
  setShowNotification: (bool: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MainRouter = ({
  showNotification,
  setShowNotification,
  audioRef,
}: Props) => {
  const dispatch = useDispatch();
  const alarms = useSelector((state: RootState) => state.alarm.alarms);

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
    const interval = setInterval(checkAlarms, 60000);
    return () => clearInterval(interval);
  }, [alarms]);

  return (
    <>
      <Routes>
        <Route path="/world-clock" element={<WorldClock />} />
        <Route path="/stopwatch" element={<Stopwatch />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/" element={<Alarm />} />
      </Routes>
    </>
  );
};

export default MainRouter;
