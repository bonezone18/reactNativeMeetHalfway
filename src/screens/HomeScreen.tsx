// src/screens/HomeScreen.tsx
import CircularButton from "../components/CircularButton";
import { Colors, Typography, Spacing, Shadows } from '../styles/theme';

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import LocationInput from "../components/LocationInput";
import { useLocationStore } from "../state/stores/locationStore";
import { useMidpointStore } from "../state/stores/midpointStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

// Define the navigation prop type for HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // ——— location store ———
  const {
    locationA,
    locationB,
    isLoadingA: isLoadingLocA,
    isLoadingB: isLoadingLocB,
    errorA,
    errorB,
    clearLocations,
    clearErrors,
  } = useLocationStore();

  // ——— midpoint store ———
  const {
    midpoint,
    isLoading: isLoadingMidpoint,
    error: midpointError,
    calculateMidpoint,
    clearMidpoint,
    distanceFromA,
    distanceFromB,
    midpointFairnessLabel,
    midpointFairnessDelta,
    clearError: clearMidpointError,
  } = useMidpointStore();

  // Combined location error (A or B)
  const locationError = errorA || errorB;

  const handleFindMidpoint = () => {
    ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
    if (locationA && locationB) {
      clearMidpointError();
      calculateMidpoint(locationA, locationB);
    } else {
      Alert.alert(
        "Missing Information",
        "Please set both locations before finding a midpoint."
      );
    }
  };

  const handleReset = () => {
    ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
    // clear everything in one shot
    clearLocations();
    clearErrors();
    clearMidpoint();
    clearMidpointError();
  };

  const navigateToResults = () => {
    ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);
    if (midpoint && locationA && locationB) {
      navigation.navigate("Results");
    } else {
      Alert.alert("Midpoint Needed", "Please calculate a midpoint first.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Meet Halfway</Text>

      <LocationInput
        isLocationA={true}
        placeholder="Your Location (Location A)"
      />
      {isLoadingLocA && <ActivityIndicator style={styles.loader} />}
      {locationA && (
        <Text style={styles.locationText}>
          A: {locationA.name || locationA.address}
        </Text>
      )}

      <LocationInput
        isLocationA={false}
        placeholder="Friend's Location (Location B)"
      />
      {isLoadingLocB && <ActivityIndicator style={styles.loader} />}
      {locationB && (
        <Text style={styles.locationText}>
          B: {locationB.name || locationB.address}
        </Text>
      )}

      {(locationError || midpointError) && (
        <Text style={styles.errorText}>
          {locationError || midpointError}
        </Text>
      )}

		<View style={styles.circularButtonContainer}>
		  <CircularButton
			onPress={handleFindMidpoint}
			disabled={isLoadingMidpoint || !locationA || !locationB}
			text="Meet!"
			size={120}
			backgroundColor="#2ECC71"
		  />
		</View>

      {isLoadingMidpoint && <ActivityIndicator style={styles.loader} />}

      {midpoint && locationA && locationB && (
        <View style={styles.midpointResultContainer}>
          <Text style={styles.resultTitle}>Calculated Midpoint:</Text>
          <Text style={styles.midpointName}>{midpoint.name}</Text>
          {midpoint.address && (
            <Text style={styles.midpointAddress}>
              {midpoint.address}
            </Text>
          )}
          <Text style={styles.fairnessText}>
            Fairness: {midpointFairnessLabel} (Δ{" "}
            {midpointFairnessDelta.toFixed(1)} km)
          </Text>
          <Text style={styles.distanceText}>
            Distance from A: {distanceFromA.toFixed(1)} km
          </Text>
          <Text style={styles.distanceText}>
            Distance from B: {distanceFromB.toFixed(1)} km
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.viewPlacesButton]}
            onPress={navigateToResults}
          >
            <Text style={styles.buttonText}>
              View Places Near Midpoint
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={handleReset}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
  flex: 1, 
  backgroundColor: Colors.background 
},
contentContainer: { 
  padding: Spacing.m 
},
title: {
  ...Typography.title,
  textAlign: "center",
  marginBottom: Spacing.l,
},

  locationText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
    marginLeft: 8,
  },
  loader: { marginVertical: 10 },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  circularButtonContainer: {
  alignItems: "center",
  justifyContent: "center",
  marginVertical: 20,
  ...Shadows.small,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  midpointResultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  midpointName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  midpointAddress: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  fairnessText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#4CAF50",
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 2,
  },
  viewPlacesButton: {
    backgroundColor: "#4CAF50",
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: "#FF3B30",
    marginTop: 10,
  },
});

export default HomeScreen;
