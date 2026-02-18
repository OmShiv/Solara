import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { 
  CELESTIAL_BODIES, 
  CelestialBody, 
  TimeRange, 
  Waypoint, 
  Location as CelestialLocation,
  generateWaypoints,
  getCelestialPosition
} from '@/lib/celestial';
import {
  getSelectedBody,
  setSelectedBody as saveSelectedBody,
  getSavedLocation,
  setSavedLocation,
  getUseGPS,
  setUseGPS as saveUseGPS,
} from '@/lib/storage';

interface CelestialContextType {
  selectedBody: CelestialBody;
  setSelectedBody: (body: CelestialBody) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  location: CelestialLocation;
  setLocation: (location: CelestialLocation) => void;
  waypoints: Waypoint[];
  currentPosition: { azimuth: number; altitude: number };
  sliderValue: number;
  setSliderValue: (value: number) => void;
  selectedWaypoint: Waypoint | null;
  cameraEnabled: boolean;
  setCameraEnabled: (enabled: boolean) => void;
  useGPS: boolean;
  setUseGPS: (use: boolean) => void;
  locationPermission: Location.PermissionStatus | null;
  requestLocationPermission: () => Promise<void>;
  isLoading: boolean;
}

const defaultLocation: CelestialLocation = {
  latitude: 40.7128,
  longitude: -74.0060,
  name: 'New York, NY'
};

const CelestialContext = createContext<CelestialContextType | undefined>(undefined);

export function CelestialProvider({ children }: { children: ReactNode }) {
  const [selectedBody, setSelectedBodyState] = useState<CelestialBody>(CELESTIAL_BODIES[0]);
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [location, setLocationState] = useState<CelestialLocation>(defaultLocation);
  const [sliderValue, setSliderValue] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [useGPS, setUseGPSState] = useState(false);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedState();
  }, []);

  async function loadSavedState() {
    try {
      const [savedBodyId, savedLocation, savedUseGPS] = await Promise.all([
        getSelectedBody(),
        getSavedLocation(),
        getUseGPS()
      ]);

      const body = CELESTIAL_BODIES.find(b => b.id === savedBodyId) || CELESTIAL_BODIES[0];
      setSelectedBodyState(body);

      if (savedLocation) {
        setLocationState(savedLocation);
      }

      setUseGPSState(savedUseGPS);

      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status);

      if (savedUseGPS && status === Location.PermissionStatus.GRANTED) {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });
          const newLocation: CelestialLocation = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            name: 'Current Location'
          };
          setLocationState(newLocation);
        } catch (error) {
          console.error('Failed to get GPS location:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function requestLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status);
    
    if (status === Location.PermissionStatus.GRANTED) {
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        const newLocation: CelestialLocation = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          name: 'Current Location'
        };
        setLocationState(newLocation);
        setSavedLocation(newLocation);
        setUseGPSState(true);
        saveUseGPS(true);
      } catch (error) {
        console.error('Failed to get location:', error);
      }
    }
  }

  function setSelectedBody(body: CelestialBody) {
    setSelectedBodyState(body);
    saveSelectedBody(body.id);
    setSliderValue(0);
  }

  function setLocation(newLocation: CelestialLocation) {
    setLocationState(newLocation);
    setSavedLocation(newLocation);
  }

  function setUseGPS(use: boolean) {
    setUseGPSState(use);
    saveUseGPS(use);
  }

  const waypoints = generateWaypoints(selectedBody.id, timeRange, location);
  
  const currentPosition = getCelestialPosition(selectedBody.id, new Date(), location);
  
  const selectedWaypointIndex = Math.min(
    Math.floor(sliderValue * waypoints.length),
    waypoints.length - 1
  );
  const selectedWaypoint = waypoints[selectedWaypointIndex] || null;

  return (
    <CelestialContext.Provider
      value={{
        selectedBody,
        setSelectedBody,
        timeRange,
        setTimeRange,
        location,
        setLocation,
        waypoints,
        currentPosition,
        sliderValue,
        setSliderValue,
        selectedWaypoint,
        cameraEnabled,
        setCameraEnabled,
        useGPS,
        setUseGPS,
        locationPermission,
        requestLocationPermission,
        isLoading,
      }}
    >
      {children}
    </CelestialContext.Provider>
  );
}

export function useCelestial() {
  const context = useContext(CelestialContext);
  if (!context) {
    throw new Error('useCelestial must be used within a CelestialProvider');
  }
  return context;
}
