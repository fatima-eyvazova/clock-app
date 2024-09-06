import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addClock, removeClock } from "../../features/worldClockSlice";
import { RootState } from "../../store";
import "./WorldClock.scss";

interface TimezoneOption {
  name: string;
  timezone: string;
}

interface TimeData {
  [timezone: string]: string;
}

const WorldClock: React.FC = () => {
  const dispatch = useDispatch();
  const clocks = useSelector((state: RootState) => state.worldClock.clocks);

  const [timezones, setTimezones] = useState<TimezoneOption[]>([]);
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([]);
  const [times, setTimes] = useState<TimeData>({});
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await fetch(
          "https://timeapi.io/api/TimeZone/AvailableTimeZones"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data: string[] = await response.json();
        const timezoneOptions: TimezoneOption[] = data.map((timezone) => ({
          name: timezone.split("/").pop()?.replace("_", " ") || "",
          timezone,
        }));
        setTimezones(timezoneOptions);
      } catch (error) {
        console.error("Error fetching timezones:", error);
      }
    };
    fetchTimezones();
  }, []);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const timeMap: TimeData = {};
        for (const timezone of selectedTimezones) {
          const response = await fetch(
            `https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data: { dateTime: string } = await response.json();
          timeMap[timezone] = new Date(data.dateTime).toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
          );
        }
        setTimes(timeMap);
      } catch (error) {
        console.error("Error fetching times:", error);
      }
    };

    if (selectedTimezones.length > 0) {
      fetchTimes();
      const intervalId = setInterval(fetchTimes, 60000);
      return () => clearInterval(intervalId);
    }
  }, [selectedTimezones]);

  useEffect(() => {
    selectedTimezones.forEach((timezone) => {
      const city = timezone.split("/").pop()?.replace("_", " ") || "";
      const time = times[timezone] || "Fetching...";

      dispatch(addClock({ city, time }));
    });
  }, [times]);

  const handleAddClock = (timezone: string) => {
    if (!selectedTimezones.includes(timezone)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
      setDropdownOpen(false);
    }
  };

  const handleRemoveClock = (city: string) => {
    dispatch(removeClock(city));

    const updatedTimezones = selectedTimezones.filter((timezone) => {
      const cityName = timezone.split("/").pop()?.replace("_", " ") || "";
      return cityName !== city;
    });

    setSelectedTimezones(updatedTimezones);
  };

  return (
    <div className="world-clock">
      <div className="timezone-add">
        <button
          className="add-button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          +
        </button>

        {dropdownOpen && (
          <div className="dropdown">
            <button
              className="dropdown-close"
              onClick={() => setDropdownOpen(false)}
            >
              X
            </button>
            <div className="dropdown-content">
              {timezones
                .filter(({ timezone }) => !selectedTimezones.includes(timezone))
                .map(({ name, timezone }, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleAddClock(timezone)}
                  >
                    {name}
                  </div>
                ))}
            </div>

            <div
              className="dropdown-overlay"
              onClick={() => setDropdownOpen(false)}
            ></div>
          </div>
        )}
      </div>
      <div className="timezone-list">
        {clocks.map((clock, index) => (
          <div key={index} className="timezone-item">
            <div className="timezone-name">{clock.city}</div>
            <div className="current-time">{clock.time}</div>
            <button
              className="delete-button"
              onClick={() => handleRemoveClock(clock.city)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldClock;
