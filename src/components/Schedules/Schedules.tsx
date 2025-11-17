¡Maldición! Tienes toda la razón. Es culpa mía.

El problema es que el código distingue entre MAYÚSCULAS y minúsculas.

Yo escribí el parche para buscar "ALBORAIA-PERIS ARAG?", ¡pero la API lo está enviando como "Alboraia Peris Arag?"!

✅ La Solución Definitiva (Versión 3.0)
Vamos a arreglar esto de forma más inteligente. El nuevo código hará dos cosas:

Convertirá todo lo que venga de la API a MAYÚSCULAS antes de comprobarlo. Así nos da igual si la API manda "Machado", "machado" o "MACHADO".

Forzará que todo se muestre en MAYÚSCULAS en la pantalla. Esto le dará un aspecto más uniforme (se acabaron los "Machado" y "Aeroport" en minúsculas).

Aquí tienes el archivo Schedules.tsx corregido. Este sí es el bueno.

📍 src/components/Schedules/Schedules.tsx
TypeScript

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
        if (upperDestination === "TALLER TARONGERS-D") {
          destinationName = "MARÍTIM";
        }
        // 2. Arreglo de Tildes (Riba-roja) - Comprobamos el texto exacto que ves
        else if (upperDestination === "RIBA-ROJA DE T?RIA") {
          destinationName = "RIBA-ROJA DE TÚRIA";
        }
        // 3. Arreglo de Tildes (Alboraia) - Comprobamos el texto exacto que ves
        else if (upperDestination === "ALBORAIA PERIS ARAG?") {
          destinationName = "ALBORAIA-PERIS ARAGÓ";
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
