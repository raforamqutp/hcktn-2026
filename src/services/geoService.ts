import { GeoPoint } from '../types';

export const NEIGHBORHOOD_CENTER = {
  lat: -16.3988,
  lng: -71.5569,
  name: 'Urb. Los Perales / Yanahuara, Arequipa',
};

export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function calculateWalkingMinutes(distanceMeters: number): number {
  return Math.max(1, Math.round(distanceMeters / 78));
}

export function createNeighborhoodPoint(
  latOffset: number,
  lngOffset: number,
  reference: string,
  privacyRadiusMeters?: number
): GeoPoint {
  const lat = Number((NEIGHBORHOOD_CENTER.lat + latOffset).toFixed(6));
  const lng = Number((NEIGHBORHOOD_CENTER.lng + lngOffset).toFixed(6));
  const distanceMeters = calculateDistanceMeters(
    NEIGHBORHOOD_CENTER.lat,
    NEIGHBORHOOD_CENTER.lng,
    lat,
    lng
  );
  return {
    lat,
    lng,
    reference,
    distanceMeters,
    walkingMinutes: calculateWalkingMinutes(distanceMeters),
    privacyRadiusMeters,
  };
}
