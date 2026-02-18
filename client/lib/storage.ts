import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location, CelestialBody } from './celestial';

const KEYS = {
  SELECTED_BODY: 'celestial_selected_body',
  SAVED_LOCATION: 'celestial_saved_location',
  USE_GPS: 'celestial_use_gps',
  DISPLAY_NAME: 'celestial_display_name',
};

export async function getSelectedBody(): Promise<string> {
  try {
    const value = await AsyncStorage.getItem(KEYS.SELECTED_BODY);
    return value || 'sun';
  } catch {
    return 'sun';
  }
}

export async function setSelectedBody(bodyId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SELECTED_BODY, bodyId);
  } catch (error) {
    console.error('Failed to save selected body:', error);
  }
}

export async function getSavedLocation(): Promise<Location | null> {
  try {
    const value = await AsyncStorage.getItem(KEYS.SAVED_LOCATION);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export async function setSavedLocation(location: Location): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SAVED_LOCATION, JSON.stringify(location));
  } catch (error) {
    console.error('Failed to save location:', error);
  }
}

export async function getUseGPS(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(KEYS.USE_GPS);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setUseGPS(useGPS: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USE_GPS, useGPS.toString());
  } catch (error) {
    console.error('Failed to save GPS preference:', error);
  }
}

export async function getDisplayName(): Promise<string> {
  try {
    const value = await AsyncStorage.getItem(KEYS.DISPLAY_NAME);
    return value || 'Stargazer';
  } catch {
    return 'Stargazer';
  }
}

export async function setDisplayName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.DISPLAY_NAME, name);
  } catch (error) {
    console.error('Failed to save display name:', error);
  }
}
