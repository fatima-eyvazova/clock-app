import { useState, useEffect } from "react";

const WorldClock = () => {
  const [country, setCountry] = useState("Europe/London");
  const [time, setTime] = useState("");
  const [timezones, setTimezones] = useState([]);

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await fetch("http://worldtimeapi.org/api/timezone");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const timezoneOptions = data.map((timezone) => ({
          name: timezone.split("/").pop().replace("_", " "),
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
    const fetchTime = async () => {
      try {
        const response = await fetch(
          `http://worldtimeapi.org/api/timezone/${country}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const localTime = new Date(data.datetime).toLocaleTimeString("en-US", {
          timeZone: country,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        setTime(localTime);
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchTime();
    const intervalId = setInterval(fetchTime, 1000);

    return () => clearInterval(intervalId);
  }, [country]);

  return (
    <div>
      <select onChange={(e) => setCountry(e.target.value)} value={country}>
        {timezones.map(({ name, timezone }) => (
          <option key={timezone} value={timezone}>
            {name}
          </option>
        ))}
      </select>
      <div>Current time: {time}</div>
    </div>
  );
};

export default WorldClock;
