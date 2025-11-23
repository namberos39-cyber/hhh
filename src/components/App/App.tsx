import React, { useEffect, useState } from "react";
import { syncStations } from "data/backend";
import Status, { StatusType } from "components/status";
import Header from "components/Header/Header";
import Schedules from "components/Schedules/Schedules";
import "typeface-titillium-web";
import "./App.scss";
import { Station } from "types/station";
import storage from "data/storage";
import logo from "images/metrovalencia/isologo.svg"; // <-- ¡Logo importado!

function App() {
  useEffect(() => {
    // 1 hora = 60 minutos * 60 segundos * 1000 milisegundos
    const UNA_HORA = 60 * 60 * 1000;

    const intervaloRefresco = setInterval(() => {
      console.log("Hora de limpiar: Refrescando la página...");
      window.location.reload(); // <-- Esto es como pulsar F5
    }, UNA_HORA);

    return () => clearInterval(intervaloRefresco);
  }, []);  
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

  if (!station) {
    const handleStationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newId = e.target.value;
      if (newId) {
        window.location.search = `?station=${newId}`;
      }
    };

    return (
      <div className="station-selector">
        {/* --- ¡AQUÍ ESTÁ EL LOGO! --- */}
        <img src={logo} alt="Logo" className="selector-logo" />
        
        <h2>Selecciona una estació</h2>
        <select onChange={handleStationSelect} defaultValue="">
          <option value="" disabled>
            -- Tria una estació --
          </option>
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

  return (
    <>
      <Header station={station} />
      <Schedules station={station} />
    </>
  );
}

export default App;
