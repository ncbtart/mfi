import { getCityCoordinates } from "./cityService";

const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

// Fonction pour récupérer les prévisions météo d'une ville spécifique
export const fetchWeatherDataForCity = async (cityName: string) => {
  const city = getCityCoordinates(cityName);

  if (!city) {
    throw new Error("City not found");
  }

  const { lat, lon } = city;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const weatherData = await response.json();

  // On récupère uniquement les trois prochains jours à partir de la réponse
  const threeDaysForecast = weatherData.daily.slice(0, 3).map((day: any) => ({
    date: new Date(day.dt * 1000).toLocaleDateString(),
    temp: day.temp.day,
    wind_speed: day.wind_speed,
    humidity: day.humidity,
    weather: {
      description: day.weather[0].description,
      icon: day.weather[0].icon,
    },
  }));

  // Récupérer la température et l'icône du jour 1
  return {
    cityName,
    temp: weatherData.daily[0].temp.day,
    icon: weatherData.daily[0].weather[0].icon, // Récupérer le code de l'icône
    forecast: threeDaysForecast,
  };
};
