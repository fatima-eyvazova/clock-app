import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WorldClock from "./pages/WorldClock/WorldClock";
import Alarm from "./pages/Alarm/Alarm";
import Stopwatch from "./pages/Stopwatch/Stopwatch";
import Timer from "./pages/Timer/Timer";
import Navigations from "./components/Navigations/Navigations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/world-clock" element={<WorldClock />} />
        <Route path="/alarm" element={<Alarm />} />
        <Route path="/stopwatch" element={<Stopwatch />} />
        <Route path="/timer" element={<Timer />} />
      </Routes>
      <Navigations />
    </Router>
  );
}

export default App;
