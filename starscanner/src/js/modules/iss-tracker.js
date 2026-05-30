import { fetchISSPosition } from "../modules/api.js";

export function coordsToPixels(lat, lon, mapWidth, mapHeight) {
  const x = ((lon + 180) / 360) * mapWidth;
  const y = ((90 - lat) / 180) * mapHeight;
  return { x, y };
}

export function initISSTracker() {
  const map = document.getElementById("iss-map");
  const marker = document.getElementById("iss-marker");
  const data = document.getElementById("iss-data");

  async function updateISS() {
    const position = await fetchISSPosition();
    const { latitude, longitude } = position;
    const mapWidth = map.offsetWidth;
    const mapHeight = map.offsetHeight;
    const { x, y } = coordsToPixels(
      parseFloat(latitude),
      parseFloat(longitude),
      mapWidth,
      mapHeight,
    );
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    data.innerHTML = `<p>Lat: ${latitude.toFixed(2)} · Lon: ${longitude.toFixed(2)}</p>`;
  }

  updateISS();
  setInterval(() => {
    updateISS();
  }, 5000);
}
