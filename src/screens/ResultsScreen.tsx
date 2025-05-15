import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { usePlaceStore } from "../state/stores/placeStore";
import { useMidpointStore } from "../state/stores/midpointStore";
import { useLocationStore } from "../state/stores/locationStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Place } from "../models/placeTypes";
import ResultsScreenContent from "../components/ResultsScreenContent";
import { Colors, Typography, Spacing, CommonStyles } from '../styles/theme';
import Button from "../components/Button";

// Define the navigation prop type for ResultsScreen
type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, "Results">;

const ResultsScreen = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const [showMap, setShowMap] = useState(true);
  
  const {
    filteredPlaces,
    isLoading,
    error,
    searchPlaces,
    getPhotoUrl,
  } = usePlaceStore();
  
  const { midpoint, setMidpoint } = useMidpointStore();
  const { locationA, locationB } = useLocationStore();

  useEffect(() => {
    if (midpoint && locationA && locationB) {
      searchPlaces(midpoint, locationA, locationB);
    }
  }, [midpoint, locationA, locationB, searchPlaces]);

  const handlePlacePress = (place: Place) => {
    navigation.navigate("PlaceDetails", { placeId: place.placeId });
  };

  const handleMidpointDrag = (newLocation: any) => {
    setMidpoint(newLocation);
    if (locationA && locationB) {
      searchPlaces(newLocation, locationA, locationB);
    }
  };

  const toggleMapVisibility = () => {
    setShowMap(!showMap);
  };

  if (isLoading && filteredPlaces.length === 0) {
    return (
      <View style={CommonStyles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={Typography.body}>Loading places...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={CommonStyles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button 
          title="Retry" 
          onPress={() => midpoint && locationA && locationB && searchPlaces(midpoint, locationA, locationB)}
          type="primary"
        />
      </View>
    );
  }

  if (!midpoint) {
    return (
      <View style={CommonStyles.centeredContainer}>
        <Text style={Typography.body}>No midpoint calculated. Please go back and set locations.</Text>
      </View>
    );
  }
  
  return (
    <View style={CommonStyles.container}>
      {isLoading && filteredPlaces.length > 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}
      
      {filteredPlaces.length === 0 && !isLoading ? (
        <View style={CommonStyles.centeredContainer}>
          <Text style={Typography.body}>No places found matching your criteria.</Text>
        </View>
      ) : (
        <ResultsScreenContent
          places={filteredPlaces}
          isLoading={isLoading}
          showMap={showMap}
          toggleMapVisibility={toggleMapVisibility}
          onPlacePress={handlePlacePress}
          getPhotoUrl={getPhotoUrl}
          onMidpointDrag={handleMidpointDrag}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: "center",
    marginBottom: Spacing.m,
  },
  loadingOverlay: {
    position: 'absolute',
    top: Spacing.m,
    right: Spacing.m,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: Spacing.s,
    borderRadius: 20,
    zIndex: 1000,
  },
});

export default ResultsScreen;
