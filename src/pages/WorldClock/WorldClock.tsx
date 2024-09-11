import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addClock, removeClock } from "../../features/worldClockSlice";
import { RootState } from "../../store";
import TimezoneDropdown from "../../components/TimezoneDropdown/TimezoneDropdown";
import TimezoneList from "../../components/TimezoneList/TimezoneList";
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
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await fetch(
          "https://timeapi.io/api/TimeZone/AvailableTimeZones"
        );
        if (!response.ok)
          throw new Error(`Failed to fetch timezones: ${response.statusText}`);
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
    const savedTimezones = localStorage.getItem("selectedTimezones");
    if (savedTimezones) {
      setSelectedTimezones(JSON.parse(savedTimezones));
    }
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
    const updateLocalTime = () => {
      setLocalTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };

    updateLocalTime();
    const intervalId = setInterval(updateLocalTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    selectedTimezones.forEach((timezone) => {
      const city = timezone.split("/").pop()?.replace("_", " ") || "";
      const time = times[timezone] || " ";

      dispatch(addClock({ city, time }));
    });
  }, [times, dispatch, selectedTimezones]);

  const handleAddClock = (timezone: string) => {
    if (!selectedTimezones.includes(timezone)) {
      const updatedTimezones = [...selectedTimezones, timezone];
      setSelectedTimezones(updatedTimezones);
      localStorage.setItem(
        "selectedTimezones",
        JSON.stringify(updatedTimezones)
      );
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
    localStorage.setItem("selectedTimezones", JSON.stringify(updatedTimezones));
  };

  return (
    <div className="world-clock">
      <div className="timezone-add">
        <button
          className="add-button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {dropdownOpen ? "X" : "+"}
        </button>

        {dropdownOpen && (
          <TimezoneDropdown
            timezones={timezones}
            selectedTimezones={selectedTimezones}
            onAddClock={handleAddClock}
            onClose={() => setDropdownOpen(false)}
          />
        )}
      </div>
      <TimezoneList
        clocks={[{ city: "Bakı", time: localTime }, ...clocks]}
        onRemoveClock={handleRemoveClock}
      />
    </div>
  );
};

export default WorldClock;
