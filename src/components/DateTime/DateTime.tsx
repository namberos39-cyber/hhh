import { useEffect, useState } from "react";
import "./DateTime.scss";

function DateTime() {
  const [date, setDate] = useState<Date>(new Date());
  // const [language, setLanguage] = useState<string>("ca"); // <-- Eliminado

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    /* El intervalo de fecha e idioma se ha eliminado
    const dateInterval = setInterval(() => {
      setLanguage((previous) => (previous === "ca" ? "es" : "ca"));
    }, 5000);
    */

    return () => {
      clearInterval(timeInterval);
      // clearInterval(dateInterval); // <-- Eliminado
    };
  }, []);

  return (
    <div className="datetime">
      <div>
        <div className="time">
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <small>
            :{date.getSeconds().toLocaleString([], { minimumIntegerDigits: 2 })}
          </small>
        </div>
        {/* La fecha se ha eliminado
        <div className="date">
          {date.toLocaleDateString(language, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        */}
      </div>
    </div>
  );
}

export default DateTime;
