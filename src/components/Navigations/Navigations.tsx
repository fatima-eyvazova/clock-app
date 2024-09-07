import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGlobe, FaBell, FaStopwatch, FaHourglassHalf } from "react-icons/fa";
import "./Navigations.scss";

const Navigations: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    return () => {
      localStorage.removeItem("stopwatch-now");
      localStorage.removeItem("timer-now");
    };
  }, []);

  return (
    <nav className="navigation">
      <ul>
        <li className={location.pathname === "/world-clock" ? "active" : ""}>
          <Link to="/world-clock">
            <FaGlobe />
            <span>World Clock</span>
          </Link>
        </li>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">
            <FaBell />
            <span>Alarm</span>
          </Link>
        </li>
        <li className={location.pathname === "/stopwatch" ? "active" : ""}>
          <Link to="/stopwatch">
            <FaStopwatch />
            <span>Stopwatch</span>
          </Link>
        </li>
        <li className={location.pathname === "/timer" ? "active" : ""}>
          <Link to="/timer">
            <FaHourglassHalf />
            <span>Timer</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigations;
