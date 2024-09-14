import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchWeatherDataForCity } from "../services/weatherService";
import { cities } from "../services/cityService";

export interface ForecastData {
  date: string;
  temp: number;
  icon: string;
  humidity: number;
  wind_speed: number;
  weather: {
    description: string;
    icon: string;
  };
}

export interface WeatherData {
  cityName: string;
  temp: number;
  icon: string;
  forecast: ForecastData[];
}

interface WeatherContextType {
  weatherData: Record<string, WeatherData>;
  loading: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Provider pour gérer le contexte météo
export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  // Récupération des données météo pour chaque ville
  useEffect(() => {
    const fetchData = async () => {
      const weatherPromises = cities.map((city) =>
        fetchWeatherDataForCity(city.name)
      );

      try {
        const results = await Promise.all(weatherPromises);
        const weatherObj = results.reduce((acc, result) => {
          acc[result.cityName] = result;
          return acc;
        }, {} as Record<string, WeatherData>);

        setWeatherData(weatherObj);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données météo :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <WeatherContext.Provider value={{ weatherData, loading }}>
      {children}
    </WeatherContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte météo
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather doit être utilisé dans un WeatherProvider");
  }
  return context;
};
