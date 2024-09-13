import { fromLonLat } from "ol/proj";
import { Map } from "ol";
import { getCityCoordinates } from "../services/cityService";

// Fonction pour zoomer et centrer sur une ville
export const zoomToCity = (map: Map | null, cityName: string) => {
  if (!map) return;

  const city = getCityCoordinates(cityName);
  if (city) {
    map.getView().animate({
      center: fromLonLat([city.lon, city.lat]),
      zoom: 8,
      duration: 1000, // Animation de zoom
    });
  }
};
