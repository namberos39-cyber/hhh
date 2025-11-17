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
          <div>LÍNIA</div>
        </div>
        <div className="destination">
          <div>DESTINACIÓ</div>
        </div>
        <div className="time">
          <div>PRÒXIMA EIXIDA</div>
        </div>
      </div>

      {departures.map((departure) => {
        // --- INICIO DEL PARCHEO (Versión robusta) ---
        let destinationName = departure.destination;

        // Convertimos a mayúsculas para comparar, así no importa cómo lo envíe la API
        const upperDestination = destinationName.toUpperCase();

        // 1. El cambio a Marítim
        if (
          upperDestination === "TALLER TARONGERS-D" ||
          upperDestination === "MAR?TIM"
        ) {
          destinationName = "MARÍTIM";
        }
        // 2. Arreglo de Tildes (Riba-roja)
        else if (upperDestination === "RIBA-ROJA DE T?RIA") {
          destinationName = "RIBA-ROJA DE TÚRIA";
        }
        // 3. Arreglo de Tildes (Alboraia)
        else if (upperDestination === "ALBORAIA PERIS ARAG?") {
          destinationName = "ALBORAIA-PERIS ARAGÓ";
        }
        // 4. Arreglo de Tildes (Llíria)
        else if (upperDestination === "LL?RIA") {
          destinationName = "LLÍRIA";
        }
        // 5. Arreglo de Tildes (Bétera)
        else if (upperDestination === "B?TERA") {
          destinationName = "BÉTERA";
        }
        // 6. Arreglo de Tildes (Castelló)
        else if (upperDestination === "CASTELL?") {
          destinationName = "CASTELLÓ";
        }
        // 7. Arreglo de Tildes (València Sud) - Añadido
        else if (upperDestination === "VAL?NCIA SUD") {
          destinationName = "VALÈNCIA SUD";
        }
        // --- FIN DEL PARCHEO ---

        return (
          <div
            key={`${departure.line}-${departure.destination}-${departure.time}`}
            className="departure"
          >
            <div className="line">
              <Line id={departure.line} />
            </div>
            <div className="destination">
              {/* Forzamos a MAYÚSCULAS para que todo se vea uniforme */}
              <div>{destinationName.toUpperCase()}</div>
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
