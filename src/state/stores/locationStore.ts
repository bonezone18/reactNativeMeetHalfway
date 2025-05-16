// src/state/stores/locationStore.ts

import { create } from "zustand";
import type { Location as LocationModel } from "../../models/locationTypes";
import { GeolocationService } from "../../services/GeolocationService";
import type { ApiError } from "../../api/types";

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
      const result: LocationModel | ApiError  = await GeolocationService.fetchCurrentLocation();
      if ("message" in result) {
        // ApiError case
        set({ errorA: result.message, isLoadingA: false });
      } else {
        // LocationModel case
        set({ locationA: result, isLoadingA: false });
      }
    } catch (err: any) {
      set({
        errorA: err?.message ?? "Failed to fetch location",
        isLoadingA: false,
      });
    }
  },

  fetchCurrentLocationB: async () => {
    set({ isLoadingB: true, errorB: null });
    try {
      const result = await GeolocationService.fetchCurrentLocation();
      if ("message" in result) {
        set({ errorB: result.message, isLoadingB: false });
      } else {
        set({ locationB: result, isLoadingB: false });
      }
    } catch (err: any) {
      set({
        errorB: err?.message ?? "Failed to fetch location",
        isLoadingB: false,
      });
    }
  },

  clearLocations: () => set({ locationA: null, locationB: null }),
  clearErrors: () => set({ errorA: null, errorB: null }),
}));
