import React, { useEffect, useState } from "react"; // <-- 'React' es necesario para el 'onChange'
import { syncStations } from "data/backend";
import Status, { StatusType } from "components/status";
import Header from "components/Header/Header";
import Schedules from "components/Schedules/Schedules";
import "typeface-titillium-web";
import "./App.scss";
import { Station } from "types/station";
import storage from "data/storage";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("station");
  const currentStation = id && parseInt(id);

  const [stations, setStations] = useState<Station[] | null>(
    storage.getItem("stations")
  );

  useEffect(() => {
    (async () => {
      await syncStations();
      setStations(storage.getItem("stations"));
    })();
  }, []);

  if (!stations) {
    return <Status full={true} type={StatusType.Loading} />;
  }

  const station =
    currentStation &&
    stations?.find((station: Station) => station.id === currentStation);

  // --- ¡AQUÍ ESTÁ LA MAGIA! ---
  // Si no hay una estación en la URL (!station)...
  if (!station) {
    // ...mostramos el selector en lugar del error.

    const handleStationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newId = e.target.value;
      if (newId) {
        // Recargamos la página con la estación seleccionada
        window.location.search = `?station=${newId}`;
      }
    };

    return (
      <div className="station-selector">
        <h2>Selecciona una estació</h2>
        <select onChange={handleStationSelect} defaultValue="">
          <option value="" disabled>
            -- Tria una estació --
          </option>
          {/* Creamos una opción por cada estación, ordenada alfabéticamente */}
          {stations
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      </div>
    );
  }

  // Si SÍ hay una estación, mostramos los horarios (como antes)
  return (
    <>
      <Header station={station} />
      <Schedules station={station} />
    </>
  );
}

export default App;
