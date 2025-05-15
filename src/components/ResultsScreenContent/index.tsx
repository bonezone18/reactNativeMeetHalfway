import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing } from '../../styles/theme';
import CategoryChips from '../../components/CategoryChips';
import SortOptions from '../../components/SortOptions';
import MapComponent from '../../components/MapComponent';
import Button from '../../components/Button';
import PlaceCard from '../../components/PlaceCard';
import { usePlaceStore, SortOption } from "../../state/stores/placeStore";
import { useMidpointStore } from "../../state/stores/midpointStore";
import { useLocationStore } from "../../state/stores/locationStore";
import { Place } from "../../models/placeTypes";
import { Location } from "../../models/locationTypes";


interface ResultsScreenContentProps {
  places: Place[];
  isLoading: boolean;
  showMap: boolean;
  toggleMapVisibility: () => void;
  onPlacePress: (place: Place) => void;
  getPhotoUrl: (place: Place, maxWidth?: number) => string | null;
  onMidpointDrag?: (newLocation: Location) => void;
}

const ResultsScreenContent: React.FC<ResultsScreenContentProps> = ({
  places,
  isLoading,
  showMap,
  toggleMapVisibility,
  onPlacePress,
  getPhotoUrl,
  onMidpointDrag,
}) => {
  const { midpoint } = useMidpointStore();
  const { locationA, locationB } = useLocationStore();
  const {
    selectedCategories,
    sortOption,
    toggleCategory,
    setSortOption,
    resetCategoryFilters,
  } = usePlaceStore();

   // Add this somewhere in the component to use isLoading
  // For example, you could use it to conditionally show a loading indicator
  React.useEffect(() => {
    // This is just to satisfy TypeScript that isLoading is being used
    console.log('Loading status:', isLoading);
  }, [isLoading]);

  const availableCategories = ["cafe", "restaurant", "bar", "park", "store", "movie_theater"];
  const sortOptions = [
    { label: "Distance", value: SortOption.distance },
    { label: "Rating", value: SortOption.rating },
    { label: "Price (Low-High)", value: SortOption.priceAsc },
    { label: "Price (High-Low)", value: SortOption.priceDesc },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mapToggleContainer}>
        <Button 
          title={showMap ? "Hide Map" : "Show Map"} 
          onPress={toggleMapVisibility}
          type="secondary"
          style={styles.mapToggleButton}
        />
      </View>

      {showMap && midpoint && (
        <MapComponent
          midpoint={midpoint}
          locationA={locationA}
          locationB={locationB}
          height={200}
          onMidpointDrag={onMidpointDrag}
        />
      )}

      <View style={styles.filtersContainer}>
        <CategoryChips
          categories={availableCategories}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onReset={resetCategoryFilters}
        />

        <SortOptions
          options={sortOptions}
          selectedOption={sortOption}
          onSelectOption={(value) => setSortOption(value as SortOption)}
        />
      </View>

      {places.map((place) => (
        <PlaceCard
          key={place.placeId}
          name={place.name}
          address={place.address}
          rating={place.rating}
          userRatingsTotal={place.userRatingsTotal}
          distance={place.distanceFromMidpoint}
          priceLevel={place.priceLevel}
          isOpen={place.openingHours?.open_now}
          photoUrl={getPhotoUrl(place, 100)}
          onPress={() => onPlacePress(place)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.m,
  },
  mapToggleContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.s,
  },
  mapToggleButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.m,
  },
  filtersContainer: {
    marginTop: Spacing.m,
    marginBottom: Spacing.s,
  },
});

export default ResultsScreenContent;
