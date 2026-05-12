type Coordinates = {
  lat: string;
  lng: string;
};

const cache = new Map<string, Coordinates>();

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

export function getCachedCoordinates(address: string) {
  return cache.get(normalizeAddress(address));
}

export function setCachedCoordinates(address: string, coordinates: Coordinates) {
  cache.set(normalizeAddress(address), coordinates);
}
