const NASA_KEY = import.meta.env.VITE_NASA_KEY;

const NASA_BASE = "https://api.nasa.gov";
const ISS_BASE = "https://api.wheretheiss.at/v1";
const METEO_BASE = "https://api.open-meteo.com/v1";

export async function fetchAPOD() {
  const cached = sessionStorage.getItem("apod");
  if (cached) {
    return JSON.parse(cached);
  }
  try {
    const response = await fetch(
      `${NASA_BASE}/planetary/apod?api_key=${NASA_KEY}`,
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    sessionStorage.setItem("apod", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("fetchAPOD failed:", error);
    return null;
  }
}

export async function fetchISSPosition() {
  try {
    const response = await fetch(`${ISS_BASE}/satellites/25544`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchISSPosition failed:", error);
    return null;
  }
}

export async function fetchISSPasses(lat, lon) {
  try {
    const response = await fetch(
      `${ISS_BASE}/iss-pass.json?lat=${lat}&lon=${lon}`,
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchISSPasses failed:", error);
    return null;
  }
}

export async function fetchWeather(lat, lon) {
  try {
    const response = await fetch(
      `${METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&hourly=cloudcover,visibility,windspeed_10m,relativehumidity_2m,precipitation_probability,weathercode&forecast_days=7`,
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchWeather failed:", error);
    return null;
  }
}

export async function fetchNEOs() {
  try {
    const response = await fetch(
      `${NASA_BASE}/neo/rest/v1/feed?api_key=${NASA_KEY}`,
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    const neos = Object.values(data.near_earth_objects).flat();
    return neos;
  } catch (error) {
    console.error("fetchNEOs failed:", error);
    return null;
  }
}
