import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from "react-native";
import { useLocationStore } from "../state/stores/locationStore";
import * as googleMapsApi from "../api/googleMapsApi";
import { PlaceSuggestion, Location as LocationModel } from "../models/placeTypes";
import { ApiError } from "../api/types";

// Helper type guard to check for ApiError
function isApiError(response: any): response is ApiError {
  return response && typeof response.message === "string";
}

interface LocationInputProps {
  isLocationA: boolean;
  placeholder: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  isLocationA,
  placeholder,
}) => {
  const {
    setLocationA,
    setLocationB,
    fetchCurrentLocationA,
    fetchCurrentLocationB,
    isLoadingA,
    isLoadingB,
  } = useLocationStore();

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isLoadingCurrent = isLocationA ? isLoadingA : isLoadingB;

  const handleInputChange = async (text: string) => {
    setInputValue(text);
    if (text.length > 2) {
      setIsFetching(true);
      setShowSuggestions(true);
      const result = await googleMapsApi.getPlaceSuggestions(text);
      if (isApiError(result)) {
        console.error("Error fetching place suggestions:", result.message);
        setSuggestions([]);
      } else {
        setSuggestions(result);
      }
      setIsFetching(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = async (s: PlaceSuggestion) => {
    setInputValue(s.description);
    setSuggestions([]);
    setShowSuggestions(false);
    Keyboard.dismiss();

    const details = await googleMapsApi.getPlaceDetails(s.place_id);
    if (isApiError(details)) {
      console.error("Error fetching place details:", details.message);
      return;
    }
    const location: LocationModel = {
      name: details.name,
      address: details.address,
      latitude: details.latitude,
      longitude: details.longitude,
    };
    if (isLocationA) setLocationA(location);
    else setLocationB(location);
  };

  const handleUseCurrent = async () => {
    if (isLocationA) await fetchCurrentLocationA();
    else await fetchCurrentLocationB();
    setInputValue("Current Location");
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={inputValue}
          onChangeText={handleInputChange}
          onFocus={() => {
            if (inputValue.length > 2 && suggestions.length) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // small delay so taps on suggestions register
            setTimeout(() => setShowSuggestions(false), 150);
          }}
        />
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrent}
          disabled={isLoadingCurrent}
        >
          {isLoadingCurrent ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.currentLocationText}>📍</Text>
          )}
        </TouchableOpacity>
      </View>

      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {isFetching && <ActivityIndicator style={{ marginVertical: 10 }} />}
          {!isFetching && suggestions.length > 0 && (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: 200 }}
            >
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s.place_id}
                  style={styles.suggestionItem}
                  onPress={() => handleSelect(s)}
                >
                  <Text>{s.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {!isFetching && !suggestions.length && inputValue.length > 2 && (
            <Text style={styles.noSuggestionsText}>
              No suggestions found.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  currentLocationButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  currentLocationText: {
    fontSize: 18,
    color: "#007AFF",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    zIndex: 1000,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  noSuggestionsText: {
    padding: 12,
    textAlign: "center",
    color: "#777",
  },
});

export default LocationInput;
