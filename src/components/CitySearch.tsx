import React, { useState, useEffect } from "react";
import { cities } from "../services/cityService"; // Importation des villes depuis le service

interface CitySearchProps {
  onCitySelect: (cityName: string) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // État pour la recherche
  const [filteredCities, setFilteredCities] = useState(cities); // Villes filtrées
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false); // Contrôle l'affichage de la liste déroulante

  // Filtrer les villes en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCities([]);
      setDropdownVisible(false);
    } else {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
      setDropdownVisible(true); // Affiche la liste déroulante lorsque des résultats sont trouvés
    }
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCitySelect = (cityName: string) => {
    setSearchQuery(cityName); // Met à jour le champ de recherche avec la ville sélectionnée
    setDropdownVisible(false); // Cache la liste déroulante après sélection
    onCitySelect(cityName); // Appel du callback pour signaler la ville sélectionnée
  };

  const handleBlur = () => {
    // Délai pour permettre à l'utilisateur de cliquer sur un élément avant de cacher la liste
    setTimeout(() => {
      setDropdownVisible(false);
    }, 200);
  };

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        {" "}
        Rechercher{" "}
      </label>

      <input
        id="search"
        type="text"
        className="rounded-md border border-gray-300 py-2 px-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Rechercher une ville"
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setDropdownVisible(true)} // Affiche la liste lorsque l'input est focalisé
        onBlur={handleBlur} // Cache la liste lorsque l'utilisateur clique en dehors
      />

      <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
        <button type="button" className="text-gray-600 hover:text-gray-700">
          <span className="sr-only">Rechercher</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </span>

      {/* Liste déroulante */}
      {isDropdownVisible && filteredCities.length > 0 && (
        <ul className="absolute z-10 w-64 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto mt-1">
          {filteredCities.map((city) => (
            <li
              key={city.name}
              onClick={() => handleCitySelect(city.name)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}

      {isDropdownVisible &&
        filteredCities.length === 0 &&
        searchQuery.length > 0 && (
          <p className="absolute z-10 w-64 bg-white border border-gray-200 rounded-md shadow-md mt-1 p-4 text-center text-gray-500">
            Aucune ville trouvée
          </p>
        )}
    </div>
  );
};

export default CitySearch;
