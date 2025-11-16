import Status, { StatusType } from "components/status";
import Line from "components/Line/Line";
import { getDepartures } from "data/backend";
import { useEffect, useState } from "react";
import { Departure } from "types/departure";
import { Station } from "types/station";
import "./Schedules.scss";

type Props = {
  station: Station;
};

function Schedules({ station }: Props) {
  const [departures, setDepartures] = useState<Departure[]>();

  useEffect(() => {
    const fetch = () => {
      getDepartures(station.id).then((departures) => setDepartures(departures));
    };

    fetch();
    const interval = setInterval(fetch, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [station]);

  if (departures === undefined) {
    return <Status full={false} type={StatusType.Loading} />;
  }

  if (departures.length === 0) {
    return <Status full={false} type={StatusType.Error} />;
  }

  return (
    <section className="schedules">
      <div className="header">
        <div className="line">
          <div>LÍNIA</div> {/* <-- Corregido! */}
        </div>
        <div className="destination">
          <div>DESTINACIÓ</div>
        </div>
        <div className="time">
          <div>PRÒXIMA EIXIDA</div>
        </div>
      </div>

      {departures.map((departure) => {
        return (
          <div
            key={`${departure.line}-${departure.destination}-${departure.time}`}
            className="departure"
          >
            <div className="line">
              <Line id={departure.line} />
            </div>
            <div className="destination">
              <div>{departure.destination}</div>
            </div>
            <div className="time">{getDepartureTime(departure.time)}</div>
          </div>
        );
      })}
    </section>
  );
}

function getDepartureTime(total: number) {
  var hours = Math.floor(total / 3600);
  var minutes = Math.floor((total % 3600) / 60);

  if (!hours && !minutes) {
    return (
      <div className="next">
        <div>immediata</div>
      </div>
    );
  }

  return (
    <>
      {hours > 0 && (
        <>
          {hours} <small>h</small>{" "}
        </>
      )}
      {minutes} <small>min</small>
    </>
  );
}

export default Schedules;
