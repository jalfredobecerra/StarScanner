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

export function getWeeklyCloudCover(data) {
  const results = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().slice(0, 10); // 1. declare dateString
    const day = date.toLocaleDateString([], { weekday: "short" });
    const index = data.hourly.time.findIndex(
      (t) => t === `${dateString}T21:00`,
    ); // 2. then use it
    if (index !== -1) {
      const cloudcover = data.hourly.cloudcover[index];
      results.push({ day, cloudcover });
    }
  }
  return results;
}

export function drawCloudChart(data) {
  const canvas = document.getElementById("cloud-chart");
  const ctx = canvas.getContext("2d");
  const weekly = getWeeklyCloudCover(data);

  const labelSpace = 20;
  const maxHeight = canvas.height - labelSpace;
  const barWidth = (canvas.width / 7) - 6;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  weekly.forEach((entry, i) => {
    const x = i * (barWidth + 4);
    const barHeight = (entry.cloudcover / 100) * maxHeight;
    const y = maxHeight - barHeight;

    ctx.fillStyle = "#282E50";
    ctx.fillRect(x, 0, barWidth, maxHeight);

    ctx.fillStyle = entry.cloudcover > 50 ? "#5A6482" : "#38BDBE";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#A0AAC8";
    ctx.font = "10px Inter";
    ctx.textAlign = "center";
    ctx.fillText(entry.day, x + barWidth / 2, canvas.height);
  });
}
