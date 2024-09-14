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
import GeoJSON from "ol/format/GeoJSON";
import { WeatherData } from "../hooks/weatherContext";

import { useWeather } from "../hooks/weatherContext";
import { cities } from "../services/cityService";
import { zoomToCity } from "../utils/mapUtils";
import Forecast from "./Forecast";
import Modal from "./Modal";

interface CityMapProps {
  onCityClick: (cityName: string) => void;
  selectedCity: string | null; // Ville sélectionnée
}

const franceStyle = new Style({
  fill: new Fill({
    color: "RGB(137, 199, 99, 1)", // Couleur de remplissage bleu transparent pour la France
  }),
  stroke: new Stroke({
    color: "#228B22", // Couleur des frontières de la France (bleu)
    width: 2,
  }),
});

// Style neutre pour les autres pays
const neutralStyle = new Style({
  fill: new Fill({
    color: "rgba(200, 200, 200, 1)", // Couleur de remplissage gris pour les autres pays
  }),
  stroke: new Stroke({
    color: "#888888", // Contours gris pour les autres pays
    width: 1,
  }),
});

const CityMap: React.FC<CityMapProps> = ({ onCityClick, selectedCity }) => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer | null>(null); // Référence à la couche vectorielle
  const selectInteractionRef = useRef<Select | null>(null); // Référence à l'interaction Select

  const { weatherData, loading } = useWeather(); // Récupération des données météo depuis le contexte
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null); // Stocke la ville sélectionnée

  const [tooltip, setTooltip] = useState<WeatherData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Stocker la position du tooltip
  // Initialisation de la carte et interaction Select (une seule fois)
  useEffect(() => {
    if (!mapRef.current && mapElement.current) {
      const vectorSource = new VectorSource({
        url: "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
        format: new GeoJSON(),
      });

      // Création de la carte
      const map = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}", // Carte de terrain Esri sans rues
            }),
          }),
          new VectorLayer({
            source: vectorSource,
            style: function (feature) {
              // Appliquer le style uniquement si le pays est la France
              return feature.get("ADMIN") === "France"
                ? franceStyle
                : neutralStyle; // Utiliser undefined au lieu de null
            },
          }),
        ],
        view: new View({
          center: fromLonLat([2.2137, 46.9]), // Centre de la France
          zoom: 6,
          minZoom: 6, // Limiter le zoom maximum
          extent: fromLonLat([-10, 35]).concat(fromLonLat([15, 55])),
        }),
      });

      // Initialisation de la couche vectorielle pour les marqueurs de ville
      vectorLayerRef.current = new VectorLayer({
        source: new VectorSource(),
      });

      // Ajoute la couche vectorielle à la carte
      map.addLayer(vectorLayerRef.current);

      // Initialisation de l'interaction Select
      const selectInteraction = new Select({
        condition: click,
        layers: [vectorLayerRef.current], // Appliquer l'interaction à la couche vectorielle
      });

      // Gestion du clic sur une ville
      selectInteraction.on("select", (e) => {
        const selected = e.selected[0] as Feature;
        if (selected) {
          const cityName = selected.get("name");
          setSelectedFeature(selected); // Stocke la ville sélectionnée
          onCityClick(cityName); // Informe l'application de la sélection
        }
      });

      map.addInteraction(selectInteraction);

      selectInteractionRef.current = selectInteraction;
      mapRef.current = map;
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
                scale: isSelected ? 1 : 0.8, // Échelle plus grande si la ville est sélectionnée
              }),
              text: new Text({
                offsetX: 10.5,
                offsetY: -30,
                text: `${Math.round(weather.temp)}°`, // Affiche la température
                fill: new Fill({ color: "#000" }),
                scale: isSelected ? 1.8 : 1.5,
                stroke: new Stroke({ color: "#fff", width: 2 }),
              }),
              stroke: new Stroke({
                color: isSelected ? "#ff0000" : "#000", // Couleur de la bordure rouge si la ville est sélectionnée
                width: isSelected ? 3 : 1, // Largeur de la bordure plus grande si la ville est sélectionnée
              }),
            })
          );

          vectorSource.addFeature(feature); // Ajoute la feature à la source vectorielle

          // Ajouter un gestionnaire pour changer le curseur sur les marqueurs

          if (mapRef.current) {
            const map = mapRef.current;

            map.on("pointermove", function (event) {
              if (!mapRef.current || !mapElement.current) return;
              const pixel = mapRef.current.getEventPixel(event.originalEvent);
              const hit = map.hasFeatureAtPixel(pixel, {
                layerFilter: (layer) => layer === vectorLayerRef.current,
              });

              if (hit) {
                const feature = map.forEachFeatureAtPixel(
                  pixel,
                  (feature) => feature
                );
                const cityName = feature?.get("name");
                const weather = weatherData[cityName];

                setTooltip(weather); // Mise à jour du tooltip
                setTooltipPosition({
                  x: event.originalEvent.clientX,
                  y: event.originalEvent.clientY,
                }); // Mise à jour de la position
                mapElement.current.style.cursor = "pointer";
              } else {
                setTooltip(null);
                mapElement.current.style.cursor = "";
              }
            });
          }
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
      className="relative rounded-lg shadow-lg overflow-hidden w-[1500px] h-[800px] mx-auto mt-2"
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

      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translate(-50%, -100%)",
            background: "white",
            padding: "5px 20px",
            borderRadius: "5px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            pointerEvents: "none",
            // Pour éviter que le tooltip interfère avec le clic
          }}
        >
          <div className="flex flex-col justify-center text-center">
            <h2 className="font-bold">{tooltip.cityName}</h2>

            <p>{Math.round(tooltip.temp)}°</p>

            <img
              src={`https://openweathermap.org/img/wn/${tooltip.forecast[0].weather.icon}.png`}
              alt={tooltip.forecast[0].weather.description}
              width="40"
              className="mx-auto -mb-2"
            />

            <p className="capitalize text-sm">
              {tooltip.forecast[0].weather.description}
            </p>

            <p className="text-xs">
              Wind : {tooltip.forecast[0].wind_speed} km/h
            </p>

            <p className="text-xs">
              Humidity : {tooltip.forecast[0].humidity}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityMap;
