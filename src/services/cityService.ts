export const cities = [
  { name: "Toulouse", lat: 43.6045, lon: 1.444 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Brest", lat: 48.3904, lon: -4.4861 },
  // @TODO Ajouter des villes supplémentaires ici
];

// Fonction utilitaire pour récupérer les coordonnées d'une ville
export const getCityCoordinates = (cityName: string) => {
  return cities.find((city) => city.name === cityName);
};
