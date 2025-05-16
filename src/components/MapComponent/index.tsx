import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Location } from '../../models/locationTypes';
import { Place } from '../../models/placeTypes'; // <-- Add this import

interface MapComponentProps {
  midpoint: Location;
  locationA?: Location | null;
  locationB?: Location | null;
  places?: Place[]; // <-- Add this line
  height?: number;
  onMidpointDrag?: (newLocation: Location) => void;
  onPlacePress?: (place: Place) => void; // <-- Optional for interactivity
}

const MapComponent: React.FC<MapComponentProps> = ({
  midpoint,
  locationA,
  locationB,
  places = [],
  height = 200,
  onMidpointDrag,
  onPlacePress,
}) => {
  const mapRef = useRef<MapView>(null);
  const [region, _setRegion] = useState<Region>({
    latitude: midpoint.latitude,
    longitude: midpoint.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    if (!mapRef.current || !locationA || !locationB) return;
    const timer = setTimeout(() => {
      try {
        mapRef.current?.fitToCoordinates(
          [
            { latitude: midpoint.latitude, longitude: midpoint.longitude },
            { latitude: locationA.latitude, longitude: locationA.longitude },
            { latitude: locationB.latitude, longitude: locationB.longitude },
          ],
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          }
        );
      } catch (error) {
        console.error('Error fitting map to coordinates:', error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [midpoint, locationA, locationB]);

  const handleMidpointDrag = (e: any) => {
    if (onMidpointDrag) {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      onMidpointDrag({
        latitude,
        longitude,
        name: 'Custom Midpoint',
      });
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        zoomControlEnabled={true}
      >
        {/* Midpoint Marker */}
        <Marker
          coordinate={{
            latitude: midpoint.latitude,
            longitude: midpoint.longitude,
          }}
          title="Midpoint"
          description="Drag to adjust"
          pinColor="green"
          draggable={true}
          onDragEnd={handleMidpointDrag}
        />

        {/* Location A Marker */}
        {locationA && (
          <Marker
            coordinate={{
              latitude: locationA.latitude,
              longitude: locationA.longitude,
            }}
            title="You"
            description={locationA.name || locationA.address}
            pinColor="red"
          />
        )}

        {/* Location B Marker */}
        {locationB && (
          <Marker
            coordinate={{
              latitude: locationB.latitude,
              longitude: locationB.longitude,
            }}
            title="Friend"
            description={locationB.name || locationB.address}
            pinColor="blue"
          />
        )}

        {/* Place Markers */}
        {places && places.map((place) => (
          <Marker
            key={place.placeId}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.address}
            pinColor="#6441A5" // purple
            onPress={() => onPlacePress && onPlacePress(place)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 8,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
