import { clamp } from "../utils/utils.js";

export function getCurrentWeather(data) {
  const now = new Date();
  const currentHour = now.toISOString().slice(0, 13);
  const index = data.hourly.time.findIndex((t) => t.startsWith(currentHour));
  const cloudcover = data.hourly.cloudcover[index];
  const humidity = data.hourly.relativehumidity_2m[index];
  const wind = data.hourly.windspeed_10m[index];
  const visibility = data.hourly.visibility[index];

  return { cloudcover, humidity, wind, visibility };
}

export function calcObservingScore(weatherData) {
  const { cloudcover, humidity, wind, visibility } = weatherData;
  const cloudScore = (1 - cloudcover / 100) * 6;
  const humidityScore = (1 - humidity / 100) * 2;
  const windScore = (1 - Math.min(wind, 50) / 50) * 1;
  const visScore = (Math.min(visibility, 48000) / 48000) * 1;
  const total = cloudScore + humidityScore + windScore + visScore;
  return Math.round(clamp(total, 1, 10) * 10) / 10;
}
