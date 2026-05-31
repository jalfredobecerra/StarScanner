import { fetchWeather, fetchAPOD } from "../modules/api.js";
import {
  getCurrentWeather,
  calcObservingScore,
  drawCloudChart,
} from "../modules/weather.js";
import { detectLocation, reverseGeocode } from "../modules/location.js";
import { initJournal } from "./journal.js";
import { openModal } from "./ui.js";

export async function initDashboard() {
  const { lat, lon } = await detectLocation();
  const city = await reverseGeocode(lat, lon);
  const weatherData = await fetchWeather(lat, lon);
  const current = getCurrentWeather(weatherData);
  const score = calcObservingScore(current);
  localStorage.setItem("lastLocation", city);
  localStorage.setItem("lastScore", score);
  const events = await getTonightEvents();
  const apod = await fetchAPOD();
  const surpriseBtn = document.getElementById("surprise-btn");
  surpriseBtn.addEventListener("click", surpriseMe);
  renderEvents(events);
  drawCloudChart(weatherData);
  renderLocation(city, lat, lon);
  renderWeather(current, score);
  renderAPOD(apod);
  initJournal(city);
}

function renderLocation(city, lat, lon) {
  const panel = document.getElementById("location-panel");
  panel.innerHTML = `
        <h3>${city}</h3>
        <p>Lat: ${lat.toFixed(2)} · Lon: ${lon.toFixed(2)}</p>
        <p>📍 Auto-detected</p>`;
}

function renderWeather(current, score) {
  const panel = document.getElementById("weather-panel");
  let scoreLabel;
  if (score >= 8) {
    scoreLabel = "Excellent";
  } else if (score >= 5) {
    scoreLabel = "Good";
  } else {
    scoreLabel = "Poor";
  }
  panel.innerHTML = `
        <p>Cloud Cover: ${current.cloudcover}%</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind: ${current.wind} km/h</p>
        <p>Visibility: ${current.visibility / 1000} km</p>
        <p>Score: ${scoreLabel} — ${score}</p>`;
}

export async function getTonightEvents() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/events.json`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    const today = new Date().getTime();
    const sevenDays = today + 7 * 24 * 60 * 60 * 1000;
    const upcoming = data.filter((event) => {
      const eventDate = new Date(event.date).getTime();
      return eventDate >= today && eventDate <= sevenDays;
    });
    return upcoming;
  } catch (error) {
    console.error("getTonightEvents failed:", error);
    return null;
  }
}

export function renderEvents(events) {
  const upcomingEvents = document.getElementById("upcoming-events");
  if (!events || events.length === 0) {
    upcomingEvents.innerHTML = "<p>No upcoming events in the next 7 days.</p>";
    return;
  }
  const html = events
    .map(
      (event, index) => `
        <div class="event-card" style="--i: ${index}">
            <h3>${event.name}</h3>
            <p>${event.date}</p>
            <p>${event.time}</p>
            <p>${event.description}</p>
            <p>${event.tip}</p>
        </div>
    `,
    )
    .join("");
  upcomingEvents.innerHTML = html;
}

export function renderAPOD(apod) {
  const panel = document.getElementById("apod-panel");
  let media;
  if (apod.media_type === "image") {
    media = `<img src="${apod.url}" alt="${apod.title}">`;
  } else {
    media = `<a href="${apod.url}" target="_blank">Watch today's video ↗</a>`;
  }
  panel.innerHTML = `
        <h3>${apod.title}</h3>
        <p>${apod.explanation}</p>
        ${media}
        <a href="${apod.hdurl}" target="_blank">View full resolution ↗</a>
        <p>${apod.copyright || "NASA"}</p>`;
}

export async function surpriseMe() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/events.json`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomEvent = data[randomIndex];
    openModal(`
            <h2>${randomEvent.name}</h2>
            <p>${randomEvent.date}</p>
            <p>${randomEvent.description}</p>
            <p>💡 ${randomEvent.tip}</p>
        `);
  } catch (error) {
    console.error("surpriseMe failed:", error);
    return null;
  }
}
