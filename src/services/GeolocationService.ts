// src/services/GeolocationService.ts

import Geolocation, {
  GeoPosition,
  GeoError,
  GeoOptions,
} from "react-native-geolocation-service";

import { PermissionsAndroid, Platform } from "react-native";
import type { Location } from "../models/locationTypes";
import { reverseGeocode } from "../api/googleMapsApi";
import type { ApiError } from "../api/types";

// 1. Default options for high-accuracy single fetch:
const defaultGeoOptions: GeoOptions = {
  enableHighAccuracy: true,
  timeout: 15_000,
  maximumAge: 10_000,
};

/** Ask Android user for fine-location permission at runtime */
async function requestLocationPermissionAndroid(): Promise<boolean> {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message:
          "This app needs access to your location to find meeting points.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn("Permission error:", err);
    return false;
  }
}

export class GeolocationService {
  /**
   * Get the device’s current position, reverse-geocode it, and
   * return either a Location or an ApiError.
   */
  static async fetchCurrentLocation(
    options: GeoOptions = defaultGeoOptions
  ): Promise<Location | ApiError> {
    // Android: check runtime permission first
    if (Platform.OS === "android") {
      const ok = await requestLocationPermissionAndroid();
      if (!ok) {
        return { message: "Location permission denied." };
      }
    }

    try {
      // 2. Wrap the callback-style API in a Promise<GeoPosition>
      const pos: GeoPosition = await new Promise<GeoPosition>(
        (resolve, reject) => {
          Geolocation.fetchCurrentPosition(
            (position) => resolve(position),
            (error) => reject(error),
            options
          );
        }
      );

      const { latitude, longitude } = pos.coords;

      // 3. Attempt reverse-geocode
      const geoResult = await reverseGeocode(latitude, longitude);

      if ("message" in geoResult) {
        // reverse-geocode failed, but we have coords
        return {
          latitude,
          longitude,
          name: "Current Location",
          address: "Address not found",
          isCurrentLocation: true,
        };
      }

      // success
      return { ...geoResult, isCurrentLocation: true };
    } catch (err: any) {
      // 4. Handle both GeoError and generic errors
      const ge: GeoError | Error = err;
      let message = ge.message ?? "Failed to get current location.";

      if ("code" in ge) {
        switch (ge.code) {
          case 1:
            message = "Location permission denied.";
            break;
          case 2:
            message = "Location provider not available.";
            break;
          case 3:
            message = "Location request timed out.";
            break;
        }
      }
      return { message };
    }
  }
}
