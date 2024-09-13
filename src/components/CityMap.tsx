import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Icon, Style, Text, Fill, Stroke } from "ol/style";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";

import { useWeather } from "../hooks/weatherContext";
import { cities } from "../services/cityService";
import { zoomToCity } from "../utils/mapUtils";
import Forecast from "./Forecast";
import Modal from "./Modal";

interface CityMapProps {
  onCityClick: (cityName: string) => void;
  selectedCity: string | null; // Ville sélectionnée
}

const CityMap: React.FC<CityMapProps> = ({ onCityClick, selectedCity }) => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer | null>(null); // Référence à la couche vectorielle
  const selectInteractionRef = useRef<Select | null>(null); // Référence à l'interaction Select

  const { weatherData, loading } = useWeather(); // Récupération des données météo depuis le contexte
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null); // Stocke la ville sélectionnée

  // Initialisation de la carte et interaction Select (une seule fois)
  useEffect(() => {
    if (!mapRef.current && mapElement.current) {
      // Création de la carte
      mapRef.current = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", // URL pour les tuiles satellite Esri
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([2.2137, 46.9]), // Centre de la France
          zoom: 6,
        }),
      });

      // Initialisation de la couche vectorielle pour les marqueurs de ville
      const vectorSource = new VectorSource();
      vectorLayerRef.current = new VectorLayer({
        source: vectorSource,
      });

      // Ajoute la couche vectorielle à la carte
      mapRef.current.addLayer(vectorLayerRef.current);

      // Initialisation de l'interaction Select
      selectInteractionRef.current = new Select({
        condition: click,
        layers: [vectorLayerRef.current], // Appliquer l'interaction à la couche vectorielle
      });

      // Gestion du clic sur une ville
      selectInteractionRef.current.on("select", (e) => {
        const selected = e.selected[0] as Feature;
        if (selected) {
          const cityName = selected.get("name");
          setSelectedFeature(selected); // Stocke la ville sélectionnée
          onCityClick(cityName); // Informe l'application de la sélection
        }
      });

      mapRef.current.addInteraction(selectInteractionRef.current);
    }
  }, [onCityClick]);

  // Ajout des villes et mise à jour des marqueurs météo
  useEffect(() => {
    if (!loading && vectorLayerRef.current) {
      const vectorSource = vectorLayerRef.current.getSource();

      if (!vectorSource) return;

      vectorSource.clear(); // Nettoie la source avant d'ajouter les nouvelles données

      // Ajoute un marqueur avec une icône météo pour chaque ville
      cities.forEach((city) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([city.lon, city.lat])),
          name: city.name,
        });

        const weather = weatherData[city.name];
        if (weather) {
          const isSelected = city.name === selectedFeature?.get("name"); // Vérifie si la ville est sélectionnée

          const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

          feature.setStyle(
            new Style({
              image: new Icon({
                anchor: [0.5, 0.5],
                src: iconUrl, // Utilise l'icône météo
                scale: isSelected ? 1.1 : 0.8, // Échelle plus grande si la ville est sélectionnée
              }),
              text: new Text({
                offsetX: 10.5,
                offsetY: -30,
                text: `${Math.round(weather.temp)}°`, // Affiche la température
                fill: new Fill({ color: "#000" }),
                scale: isSelected ? 1.8 : 1.5,
                stroke: new Stroke({ color: "#fff", width: 2 }),
              }),
            })
          );

          vectorSource.addFeature(feature); // Ajoute la feature à la source vectorielle
        }
      });
    }
  }, [loading, weatherData, selectedFeature]); // Met à jour les marqueurs à chaque changement

  // Zoom sur la ville sélectionnée
  useEffect(() => {
    if (selectedCity) {
      zoomToCity(mapRef.current, selectedCity);
    }
  }, [selectedCity]);

  return (
    <div
      ref={mapElement}
      className="relative rounded-lg shadow-lg overflow-hidden w-[800px] h-[800px] mx-auto mt-2"
    >
      {selectedFeature && (
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title={`Prévision météo pour ${selectedFeature.get("name")}`}
        >
          <Forecast
            forecast={weatherData[selectedFeature.get("name")].forecast}
            city={selectedFeature.get("name")}
          />
        </Modal>
      )}
    </div>
  );
};

export default CityMap;
