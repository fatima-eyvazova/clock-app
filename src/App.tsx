import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WorldClock from "./pages/WorldClock/WorldClock";
import Stopwatch from "./pages/Stopwatch/Stopwatch";
import Timer from "./pages/Timer/Timer";
import Navigations from "./components/Navigations/Navigations";
import Alarm from "./pages/Alarm/Alarm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/world-clock" element={<WorldClock />} />
        <Route path="/stopwatch" element={<Stopwatch />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/" element={<Alarm />} />
      </Routes>
      <Navigations />
    </Router>
  );
}

export default App;
