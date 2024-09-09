import { BrowserRouter as Router } from "react-router-dom";
import Navigations from "./components/Navigations/Navigations";
import AlarmNotification from "./components/AlarmNotification";
import MainRouter from "./MainRouter";
import { useRef, useState } from "react";
import "./App.css";
import audioAlarm from "../public/sounds/signal-elektronnogo-budilnika-33304.mp3";
function App() {
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showTimerNotification, setShowTimerNotification] =
    useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioTimerRef = useRef<HTMLAudioElement | null>(null);

  const handleNotificationClose = () => {
    setShowNotification(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleTimerNotificationClose = () => {
    setShowTimerNotification(false);
    if (audioTimerRef.current) {
      audioTimerRef.current.pause();
      audioTimerRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <Router>
        <AlarmNotification />
        <MainRouter
          showNotification={showNotification}
          setShowNotification={setShowNotification}
          audioRef={audioRef}
          timerRef={timerRef}
          audioTimerRef={audioTimerRef}
          setShowTimerNotification={setShowTimerNotification}
        />
        <Navigations />
      </Router>
      {showNotification && (
        <div className="notification">
          <p>⏰ Time's up!</p>
          <button onClick={handleNotificationClose} className="close-button">
            X
          </button>
        </div>
      )}
      <audio ref={audioRef} src={audioAlarm} preload="auto" />
      {showTimerNotification && (
        <div className="notification">
          <p>⏰ Time's up!</p>
          <button
            onClick={handleTimerNotificationClose}
            className="close-button"
          >
            X
          </button>
        </div>
      )}
      <audio ref={audioTimerRef} src={audioAlarm} preload="auto" />
    </>
  );
}

export default App;
