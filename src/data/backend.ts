import { DateTime } from "luxon";
import { Departure } from "types/departure";
import { BackendDeparture } from "types/backend/departure";
import { BackendStation } from "types/backend/station";
import { BackendTrain } from "types/backend/train";
import { Station } from "types/station";
import storage from "./storage";

const baseUrl = "/api";

export async function syncStations() {
  let lastSyncRaw = storage.getItem("lastSync");

  if (lastSyncRaw === null) {
    lastSyncRaw = "2023-01-01";
  }

  const lastSync = DateTime.fromISO(lastSyncRaw);

  try {
    const { data } = await fetch(
      `${baseUrl}/sincronizacion?fecha_desde=${lastSync.toFormat(
        "yyyy-LL-dd%20HH:mm:uu"
      )}`
    ).then((response) => response.json());

    if (data.estaciones.length === 0) {
      return; // No hay estaciones nuevas, no hacemos nada
    }

    // --- INICIO DEL ARREGLO ---
    // 1. Coge las estaciones que YA tenías y mételas en un Map (para evitar duplicados)
    let stationsMap = new Map<number, Station>(
      (storage.getItem("stations") || []).map((s) => [s.id, s])
    );

    // 2. Procesa las nuevas estaciones
    data.estaciones.forEach((station: BackendStation) => {
      const newStation: Station = {
        id: station.estacion_id_FGV,
        name: station.nombre,
        transfer: station.transbordo === 0,
        latitude: station.latitud,
        longitude: station.longitud,
      };
      // 3. Añade la nueva o actualiza la existente en el Map
      stationsMap.set(newStation.id, newStation);
    });

    // 4. Convierte el Map de nuevo a un array
    const stationsArray = Array.from(stationsMap.values());

    storage.setItem("lastSync", DateTime.now().toJSON());
    storage.setItem("stations", stationsArray); // Guarda la lista fusionada y sin duplicados
    // --- FIN DEL ARREGLO ---
    
  } catch (error) {
    console.error(error);
  }
}

export async function getDepartures(stationId: number): Promise<Departure[]> {
  let departures: Departure[] = [];

  const response = await fetch(
    `${baseUrl}/horarios-prevision-3/${stationId}`
  ).then((response) => response.json());

  response.previsiones.forEach((departure: BackendDeparture) =>
    departure.trains.forEach((train: BackendTrain) =>
      departures.push({
        line: departure.line,
        destination: train.destino,
        time: train.seconds,
        occupancy: train.capacity,
      })
    )
  );

  departures = departures.sort((a, b) => {
    return a.time > b.time ? 1 : -1;
  });

  return departures;
}
