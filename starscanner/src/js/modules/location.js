export function detectLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        reject("Unable to detect location. Please enable location access.");
      },
    );
  });
}

export async function reverseGeocode(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: { "User-Agent": "StarScanner/1.0" },
      },
    );
    const data = await response.json();
    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      "Unknown Location"
    );
  } catch {
    return "Unknown Location";
  }
}
