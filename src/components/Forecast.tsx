import React from "react";
import { formatDateToFrenchLocale } from "../utils/dateUtils";

interface ForecastProps {
  forecast: any;
  city: string | null;
}

const Forecast: React.FC<ForecastProps> = ({ forecast, city }) => {
  return (
    <div>
      <div className="flex justify-between">
        {forecast.map((day: any, index: number) => (
          <div key={index} className="w-full md:w-1/3 lg:w-1/4 p-2">
            <div className="bg-white p-3 rounded-lg shadow flex flex-col items-center h-full">
              {/* Format de la date avec la locale française */}
              <p className="text-sm text-gray-800 text-center">
                {formatDateToFrenchLocale(day.date)}
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                alt={day.weather.description}
                width="50"
                className="mx-auto"
              />
              <p className="font-bold">{Math.round(day.temp)}°C</p>
              <p className="text-sm text-gray-600 text-center">
                {day.weather.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
