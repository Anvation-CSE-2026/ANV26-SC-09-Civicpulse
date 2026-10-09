/**
 * CivicPulse Geocoding Utilities
 * Provides browser geolocation retrieval and reverse geocoding via OpenStreetMap Nominatim.
 */

/**
 * Reverse-geocode latitude and longitude using OpenStreetMap Nominatim API.
 * Prefers locality in the following order:
 * address.suburb -> address.neighbourhood -> address.city_district ->
 * address.town -> address.city -> address.village
 *
 * @param {number|string} lat
 * @param {number|string} lng
 * @returns {Promise<{ areaName: string, displayName: string }>}
 */
export async function reverseGeocode(lat, lng) {
  if (lat == null || lng == null || isNaN(Number(lat)) || isNaN(Number(lng))) {
    return {
      areaName: 'Location selected on map',
      displayName: ''
    };
  }

  const roundedLat = Number(lat).toFixed(6);
  const roundedLng = Number(lng).toFixed(6);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${roundedLat}&lon=${roundedLng}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status ${response.status}`);
    }

    const data = await response.json();
    const addr = data.address || {};

    const locality =
      addr.quarter ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.city_district ||
      addr.town ||
      addr.city ||
      addr.village ||
      data.name ||
      'Location selected on map';

    return {
      areaName: locality,
      displayName: data.display_name || locality
    };
  } catch (error) {
    console.warn('Reverse geocoding request failed:', error);
    return {
      areaName: 'Location selected on map',
      displayName: ''
    };
  }
}

/**
 * Request browser geolocation using the HTML5 Geolocation API.
 * Returns { lat, lng } or rejects with a clean user-facing error message.
 *
 * @returns {Promise<{ lat: number, lng: number }>}
 */
export function getCurrentBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator || !navigator.geolocation) {
      const err = new Error('Browser does not support geolocation. Please pin the incident location on the map.');
      err.code = 'NOT_SUPPORTED';
      return reject(err);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 1000000) / 1000000;
        const lng = Math.round(pos.coords.longitude * 1000000) / 1000000;
        resolve({ lat, lng });
      },
      (err) => {
        let msg = 'Unable to determine your location. Please pin the incident location on the map.';
        if (err.code === 1) { // PERMISSION_DENIED
          msg = 'Location permission denied. Please pin the incident location on the map.';
        } else if (err.code === 3) { // TIMEOUT
          msg = 'Location request timed out. Please pin the incident location on the map.';
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
          msg = 'Location information is currently unavailable. Please pin the incident location on the map.';
        }
        const error = new Error(msg);
        error.code = err.code;
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}
