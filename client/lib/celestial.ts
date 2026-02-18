export interface CelestialBody {
  id: string;
  name: string;
  type: 'sun' | 'moon' | 'planet' | 'star';
  symbol: string;
  color: string;
}

export const CELESTIAL_BODIES: CelestialBody[] = [
  { id: 'sun', name: 'Sun', type: 'sun', symbol: 'sun', color: '#F7B801' },
  { id: 'moon', name: 'Moon', type: 'moon', symbol: 'moon', color: '#C0C0C0' },
  { id: 'mercury', name: 'Mercury', type: 'planet', symbol: 'circle', color: '#B5B5B5' },
  { id: 'venus', name: 'Venus', type: 'planet', symbol: 'circle', color: '#E6C35C' },
  { id: 'mars', name: 'Mars', type: 'planet', symbol: 'circle', color: '#E55B3C' },
  { id: 'jupiter', name: 'Jupiter', type: 'planet', symbol: 'circle', color: '#D4A574' },
  { id: 'saturn', name: 'Saturn', type: 'planet', symbol: 'circle', color: '#C9B896' },
];

export type TimeRange = 'day' | 'week' | 'month';

export interface Waypoint {
  id: string;
  time: Date;
  azimuth: number;
  altitude: number;
  label: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function julianDate(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + 
    (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;
  
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function getSunPosition(date: Date, lat: number, lon: number): { azimuth: number; altitude: number } {
  const jd = julianDate(date);
  const n = jd - 2451545.0;
  
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * DEG_TO_RAD;
  
  const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * DEG_TO_RAD;
  const epsilon = 23.439 * DEG_TO_RAD;
  
  const alpha = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
  const delta = Math.asin(Math.sin(epsilon) * Math.sin(lambda));
  
  const gmst = (18.697374558 + 24.06570982441908 * n) % 24;
  const lst = gmst + lon / 15;
  const ha = (lst * 15 - alpha * RAD_TO_DEG) * DEG_TO_RAD;
  
  const latRad = lat * DEG_TO_RAD;
  const alt = Math.asin(Math.sin(latRad) * Math.sin(delta) + Math.cos(latRad) * Math.cos(delta) * Math.cos(ha));
  const az = Math.atan2(
    -Math.sin(ha),
    Math.tan(delta) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(ha)
  );
  
  return {
    azimuth: ((az * RAD_TO_DEG + 180) % 360),
    altitude: alt * RAD_TO_DEG
  };
}

function getMoonPosition(date: Date, lat: number, lon: number): { azimuth: number; altitude: number } {
  const jd = julianDate(date);
  const T = (jd - 2451545.0) / 36525;
  
  const L0 = (218.3164477 + 481267.88123421 * T) % 360;
  const M = (134.9633964 + 477198.8675055 * T) % 360;
  const F = (93.2720950 + 483202.0175233 * T) % 360;
  
  const lambda = L0 + 6.289 * Math.sin(M * DEG_TO_RAD);
  const beta = 5.128 * Math.sin(F * DEG_TO_RAD);
  
  const epsilon = 23.439 * DEG_TO_RAD;
  const lambdaRad = lambda * DEG_TO_RAD;
  const betaRad = beta * DEG_TO_RAD;
  
  const alpha = Math.atan2(
    Math.sin(lambdaRad) * Math.cos(epsilon) - Math.tan(betaRad) * Math.sin(epsilon),
    Math.cos(lambdaRad)
  );
  const delta = Math.asin(
    Math.sin(betaRad) * Math.cos(epsilon) + Math.cos(betaRad) * Math.sin(epsilon) * Math.sin(lambdaRad)
  );
  
  const n = jd - 2451545.0;
  const gmst = (18.697374558 + 24.06570982441908 * n) % 24;
  const lst = gmst + lon / 15;
  const ha = (lst * 15 - alpha * RAD_TO_DEG) * DEG_TO_RAD;
  
  const latRad = lat * DEG_TO_RAD;
  const alt = Math.asin(Math.sin(latRad) * Math.sin(delta) + Math.cos(latRad) * Math.cos(delta) * Math.cos(ha));
  const az = Math.atan2(
    -Math.sin(ha),
    Math.tan(delta) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(ha)
  );
  
  return {
    azimuth: ((az * RAD_TO_DEG + 180) % 360),
    altitude: alt * RAD_TO_DEG
  };
}

function getPlanetPosition(date: Date, lat: number, lon: number, planetId: string): { azimuth: number; altitude: number } {
  const sunPos = getSunPosition(date, lat, lon);
  
  const offsets: Record<string, { azOffset: number; altOffset: number }> = {
    mercury: { azOffset: 15, altOffset: -5 },
    venus: { azOffset: 25, altOffset: 10 },
    mars: { azOffset: -30, altOffset: 5 },
    jupiter: { azOffset: 45, altOffset: -10 },
    saturn: { azOffset: -60, altOffset: -15 },
  };
  
  const offset = offsets[planetId] || { azOffset: 0, altOffset: 0 };
  
  return {
    azimuth: (sunPos.azimuth + offset.azOffset + 360) % 360,
    altitude: Math.max(-90, Math.min(90, sunPos.altitude + offset.altOffset))
  };
}

export function getCelestialPosition(
  bodyId: string,
  date: Date,
  location: Location
): { azimuth: number; altitude: number } {
  const { latitude, longitude } = location;
  
  switch (bodyId) {
    case 'sun':
      return getSunPosition(date, latitude, longitude);
    case 'moon':
      return getMoonPosition(date, latitude, longitude);
    default:
      return getPlanetPosition(date, latitude, longitude, bodyId);
  }
}

export function generateWaypoints(
  bodyId: string,
  timeRange: TimeRange,
  location: Location,
  baseDate: Date = new Date()
): Waypoint[] {
  const waypoints: Waypoint[] = [];
  
  switch (timeRange) {
    case 'day': {
      const startOfDay = new Date(baseDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 12; i++) {
        const time = new Date(startOfDay.getTime() + i * 2 * 60 * 60 * 1000);
        const pos = getCelestialPosition(bodyId, time, location);
        waypoints.push({
          id: `waypoint-${i}`,
          time,
          azimuth: pos.azimuth,
          altitude: pos.altitude,
          label: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      break;
    }
    case 'week': {
      const currentHour = baseDate.getHours();
      const startOfWeek = new Date(baseDate);
      startOfWeek.setDate(startOfWeek.getDate() - 3);
      startOfWeek.setHours(currentHour, 0, 0, 0);
      
      for (let i = 0; i < 7; i++) {
        const time = new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000);
        const pos = getCelestialPosition(bodyId, time, location);
        waypoints.push({
          id: `waypoint-${i}`,
          time,
          azimuth: pos.azimuth,
          altitude: pos.altitude,
          label: time.toLocaleDateString([], { weekday: 'short', day: 'numeric' })
        });
      }
      break;
    }
    case 'month': {
      const currentHour = baseDate.getHours();
      const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
      const startOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
      startOfMonth.setHours(currentHour, 0, 0, 0);
      
      for (let i = 0; i < daysInMonth; i++) {
        const time = new Date(startOfMonth.getTime() + i * 24 * 60 * 60 * 1000);
        const pos = getCelestialPosition(bodyId, time, location);
        waypoints.push({
          id: `waypoint-${i}`,
          time,
          azimuth: pos.azimuth,
          altitude: pos.altitude,
          label: time.toLocaleDateString([], { day: 'numeric', month: 'short' })
        });
      }
      break;
    }
  }
  
  return waypoints;
}

export function formatAzimuth(azimuth: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(azimuth / 45) % 8;
  return `${Math.round(azimuth)}° ${directions[index]}`;
}

export function formatAltitude(altitude: number): string {
  return `${Math.round(altitude)}°`;
}
