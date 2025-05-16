// src/state/stores/locationStore.ts

import { create } from "zustand";
import type { Location as LocationModel } from "../../models/locationTypes";
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { reverseGeocode } from "../../api/googleMapsApi";

// Define GeolocationPosition type if not available
interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

// Permission request function
const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  }

  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Meet Halfway needs access to your location to find places near you.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  
  return false;
};

export interface LocationState {
  locationA: LocationModel | null;
  locationB: LocationModel | null;
  isLoadingA: boolean;
  isLoadingB: boolean;
  errorA: string | null;
  errorB: string | null;

  setLocationA: (loc: LocationModel | null) => void;
  setLocationB: (loc: LocationModel | null) => void;

  fetchCurrentLocationA: () => Promise<void>;
  fetchCurrentLocationB: () => Promise<void>;

  clearLocations: () => void;
  clearErrors: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  // ─────────── state
  locationA: null,
  locationB: null,
  isLoadingA: false,
  isLoadingB: false,
  errorA: null,
  errorB: null,

  // ─────────── actions
  setLocationA: (loc) => set({ locationA: loc, errorA: null }),
  setLocationB: (loc) => set({ locationB: loc, errorB: null }),

  fetchCurrentLocationA: async () => {
    set({ isLoadingA: true, errorA: null });
    try {
      // Request permission first
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }
      
      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          pos => resolve(pos as GeolocationPosition),
          error => reject(error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
      
      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get address
      const location = await reverseGeocode(latitude, longitude);
      
      if ('message' in location) {
        throw new Error(location.message);
      }
      
      set({ locationA: location });
    } catch (err: any) {
      console.error('Error getting current location:', err);
      set({
        errorA: err?.message ?? "Failed to fetch location",
      });
    } finally {
      set({ isLoadingA: false });
    }
  },

  fetchCurrentLocationB: async () => {
    set({ isLoadingB: true, errorB: null });
    try {
      // Request permission first
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }
      
      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          pos => resolve(pos as GeolocationPosition),
          error => reject(error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
      
      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get address
      const location = await reverseGeocode(latitude, longitude);
      
      if ('message' in location) {
        throw new Error(location.message);
      }
      
      set({ locationB: location });
    } catch (err: any) {
      console.error('Error getting current location:', err);
      set({
        errorB: err?.message ?? "Failed to fetch location",
      });
    } finally {
      set({ isLoadingB: false });
    }
  },

  clearLocations: () => set({ locationA: null, locationB: null }),
  clearErrors: () => set({ errorA: null, errorB: null }),
}));
