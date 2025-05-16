// src/api/googleMapsApi.ts

import { GOOGLE_MAPS_API_KEY } from '@env';
import axios from "axios";
import { Alert } from "react-native";
import { Location, Place, PlaceSuggestion } from "../models/placeTypes";
import {
  GeocodingResponse,
  NearbySearchResponse,
  AutocompleteResponse,
  PlaceDetailsResponse,
  DirectionsResponse,
  ApiError,
} from "./types";

const BASE_URL = "https://maps.googleapis.com/maps/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: GOOGLE_MAPS_API_KEY,
  },
});

/**
 * Centralized error handler:
 * - Maps common Google‐API statuses to friendly messages
 * - Alerts the user once
 * - Returns an ApiError suitable for your callers
 */
function handleApiError(
  error: any,
  defaultMessage: string
): ApiError {
  let message = defaultMessage;
  let status: string | undefined;

  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data;
    status = data.status;

    // Prefer an explicit Google error_message if present
    if (typeof data.error_message === "string") {
      message = data.error_message;
    } else {
      // Fallback by status
      switch (data.status) {
        case "OVER_QUERY_LIMIT":
          message = "Quota exceeded. Try again later.";
          break;
        case "REQUEST_DENIED":
          message = "Request was denied. Check your API key settings.";
          break;
        case "UNKNOWN_ERROR":
          message = "Google service unavailable. Please try again shortly.";
          break;
        // you can add more `case`s here for other statuses
        default:
          message = defaultMessage;
      }
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Show a single alert to the user
  Alert.alert("Network Error", message);

  return { message, status };
}

export const geocodeAddress = async (
  address: string
): Promise<Location | ApiError> => {
  if (!GOOGLE_MAPS_API_KEY) {
    return { message: "Missing Google Maps API key." };
  }
  try {
    const res = await apiClient.get<GeocodingResponse>("/geocode/json", {
      params: { address },
    });
    const data = res.data;

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return {
        latitude: lat,
        longitude: lng,
        address: data.results[0].formatted_address,
        name: address,
      };
    }

    // ZERO_RESULTS or other status
    const fallback =
      data.status === "ZERO_RESULTS"
        ? { latitude: 0, longitude: 0, address: "Not found", name: address }
        : { message: data.error_message || `Geocode failed: ${data.status}`, status: data.status };

    if ("message" in fallback) {
      return fallback as ApiError;
    }
    return fallback as Location;
  } catch (err) {
    return handleApiError(err, "Failed to geocode address");
  }
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<Location | ApiError> => {
  if (!GOOGLE_MAPS_API_KEY) {
    return { message: "Missing Google Maps API key." };
  }
  try {
    const res = await apiClient.get<GeocodingResponse>("/geocode/json", {
      params: { latlng: `${latitude},${longitude}` },
    });
    const data = res.data;

    if (data.status === "OK" && data.results.length > 0) {
      const formatted = data.results[0].formatted_address;
      return {
        latitude,
        longitude,
        address: formatted,
        name: formatted.split(",")[0],
        isCurrentLocation: true,
      };
    }

    if (data.status === "ZERO_RESULTS") {
      return {
        latitude,
        longitude,
        address: "Unknown location",
        name: "Current Location",
        isCurrentLocation: true,
      };
    }

    return {
      message: data.error_message || `Reverse geocode failed: ${data.status}`,
      status: data.status,
    };
  } catch (err) {
    return handleApiError(err, "Failed to reverse geocode coordinates");
  }
};

export const fetchPlaceSuggestions = async (
  input: string
): Promise<PlaceSuggestion[] | ApiError> => {
  if (!GOOGLE_MAPS_API_KEY) {
    return { message: "Missing Google Maps API key." };
  }
  if (!input.trim()) {
    return [];
  }
  try {
    const res = await apiClient.get<AutocompleteResponse>(
      "/place/autocomplete/json",
      { params: { input } }
    );
    const data = res.data;

    if (data.status === "OK") {
      return data.predictions.map((p) => ({
        description: p.description,
        place_id: p.place_id,
      }));
    }

    if (data.status === "ZERO_RESULTS") {
      return [];
    }

    return {
      message: data.error_message || `Suggestions failed: ${data.status}`,
      status: data.status,
    };
  } catch (err) {
    return handleApiError(err, "Failed to fetch place suggestions");
  }
};

export const fetchPlaceDetails = async (
  placeId: string
): Promise<Place | ApiError> => {
  if (!GOOGLE_MAPS_API_KEY) {
    return { message: "Missing Google Maps API key." };
  }
  try {
    const res = await apiClient.get<PlaceDetailsResponse>(
      "/place/details/json",
      {
        params: {
          place_id: placeId,
          fields:
            "place_id,name,formatted_address,geometry,vicinity,photos,rating,user_ratings_total,opening_hours,types,price_level,website,international_phone_number,reviews,icon_mask_base_uri,icon_background_color,icon",
        },
      }
    );
    const data = res.data;

    if (data.status === "OK") {
      const r = data.result;
      return {
        placeId: r.place_id || placeId,
        name: r.name || "Unknown Place",
        address: r.formatted_address || r.vicinity,
        vicinity: r.vicinity,
        latitude: r.geometry.location.lat,
        longitude: r.geometry.location.lng,
        rating: r.rating,
        userRatingsTotal: r.user_ratings_total,
        photos: r.photos,
        photoReference: r.photos?.[0]?.photo_reference,
        openingHours: r.opening_hours
          ? {
              open_now: r.opening_hours.open_now,
              weekday_text: r.opening_hours.weekday_text,
            }
          : undefined,
        types: r.types || [],
        priceLevel: r.price_level,
        icon: r.icon,
        distanceFromMidpoint: 0,
      };
    }

    return {
      message: data.error_message || `Details failed: ${data.status}`,
      status: data.status,
    };
  } catch (err) {
    return handleApiError(err, "Failed to fetch place details");
  }
};

export const searchNearbyPlaces = async (
  location: Location,
  radius = 5000,
  type?: string
): Promise<Place[] | ApiError> => {
  if (!GOOGLE_MAPS_API_KEY) {
    return { message: "Missing Google Maps API key." };
  }
  try {
    const params: any = {
      location: `${location.latitude},${location.longitude}`,
      radius,
    };
    if (type) {
      params.type = type;
    }
    const res = await apiClient.get<NearbySearchResponse>(
      "/place/nearbysearch/json",
      { params }
    );
    const data = res.data;

    if (data.status === "OK") {
      return data.results.map((p) => ({
        placeId: p.place_id,
        name: p.name,
        latitude: p.geometry.location.lat,
        longitude: p.geometry.location.lng,
        vicinity: p.vicinity,
        address: p.formatted_address,
        rating: p.rating,
        userRatingsTotal: p.user_ratings_total,
        photoReference: p.photos?.[0]?.photo_reference,
        photos: p.photos,
        openingHours: p.opening_hours,
        types: p.types,
        priceLevel: p.price_level,
        icon: p.icon,
        distanceFromMidpoint: 0,
      }));
    }

    if (data.status === "ZERO_RESULTS") {
      return [];
    }

    return {
      message: data.error_message || `Search failed: ${data.status}`,
      status: data.status,
    };
  } catch (err) {
    return handleApiError(err, "Failed to search nearby places");
  }
};

export const fetchPhotoUrl = (
  photoReference: string,
  maxWidth = 400
): string | null => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("Missing Google Maps API key for photo URL");
    return null;
  }
  return `${BASE_URL}/place/photo?maxwidth=${maxWidth}` +
    `&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
};

export const fetchDirections = async (
  origin: Location,
  destination: Location,
  mode = "driving"
): Promise<DirectionsResponse["routes"][0]["legs"][0] | ApiError> => {
  if (!GOOGLE_MAPS_API_KEY) {
    return { message: "Missing Google Maps API key." };
  }
  try {
    const res = await apiClient.get<DirectionsResponse>(
      "/directions/json",
      {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          mode,
        },
      }
    );
    const data = res.data;

    if (data.status === "OK" && data.routes.length > 0) {
      return data.routes[0].legs[0];
    }

    if (data.status === "ZERO_RESULTS") {
      return { message: "No routes found", status: "ZERO_RESULTS" };
    }

    return {
      message: data.error_message || `Directions failed: ${data.status}`,
      status: data.status,
    };
  } catch (err) {
    return handleApiError(err, "Failed to fetch directions");
  }
};

export const fetchStaticMapUrl = (
  origin: Location,
  destination: Location,
  midpoint: Location,
  width = 600,
  height = 300
): string | null => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("Missing Google Maps API key for static map URL");
    return null;
  }
  const markers =
    `markers=color:red|label:A|${origin.latitude},${origin.longitude}` +
    `&markers=color:green|label:M|${midpoint.latitude},${midpoint.longitude}` +
    `&markers=color:blue|label=B|${destination.latitude},${destination.longitude}`;

  return `${BASE_URL}/staticmap?size=${width}x${height}&${markers}&key=${GOOGLE_MAPS_API_KEY}`;
};
