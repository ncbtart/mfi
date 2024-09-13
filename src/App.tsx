import React, { useState } from "react";
import "./App.css";

import CityMap from "./components/CityMap";
import { WeatherProvider } from "./hooks/weatherContext";
import CitySearch from "./components/CitySearch";

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Gestion de la sélection de la ville
  const handleCitySelect = (cityName: string) => {
    setSelectedCity(null);
    // Utilisation de setTimeout pour forcer la mise à jour de l'état si la ville est la même que celle déjà sélectionnée
    setTimeout(() => {
      setSelectedCity(cityName);
    }, 0);
  };

  const handleCityClick = (cityName: string) => {
    console.log(`Ville sélectionnée : ${cityName}`);
  };

  return (
    <WeatherProvider>
      <div className="bg-gray-50 h-screen">
        <div className="sticky inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-screen-xl px-4 relative flex h-16 items-center gap-4 sm:gap-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl text-blue-900">
              MFI City Weather Forecast
            </h1>
            <CitySearch onCitySelect={handleCitySelect} />
          </div>
        </div>

        <CityMap onCityClick={handleCityClick} selectedCity={selectedCity} />
      </div>
    </WeatherProvider>
  );
};

export default App;
