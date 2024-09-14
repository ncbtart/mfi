import React from "react";
import { formatDateToFrenchLocale } from "../utils/dateUtils";
import { ForecastData } from "../hooks/weatherContext";

interface ForecastProps {
  forecast: ForecastData[];
  city: string | null;
}

const Forecast: React.FC<ForecastProps> = ({ forecast, city }) => {
  console.log(forecast);

  return (
    <div className="py-8 bg-gradient-to-b from-blue-500 to-blue-400 rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl text-white">
          Weather forecast {city ? `for ${city}` : ""}
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {forecast.map((day: ForecastData, index: number) => (
          <div
            key={index}
            className="w-[30%] p-4 transition transform hover:scale-105"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all flex flex-col items-center h-full border border-gray-200 hover:border-blue-400">
              {/* Format de la date avec la locale française */}
              <p className="text-sm text-gray-700 mb-2 capitalize font-bold">
                {formatDateToFrenchLocale(day.date)}
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                alt={day.weather.description}
                width="80"
                className="mb-4"
              />
              <p className="text-2xl font-bold text-blue-500 mb-2">
                {Math.round(day.temp)}°C
              </p>
              <p className="text-sm text-gray-600 text-center capitalize mb-2">
                {day.weather.description}
              </p>

              <div className="mt-auto">
                <p className="text-xs text-gray-500">Wind : {day.wind_speed}</p>
                <p className="text-xs text-gray-500">
                  Humidity : {day.humidity}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
