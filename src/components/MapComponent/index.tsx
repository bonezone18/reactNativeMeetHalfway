import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Location } from '../../models/locationTypes';

interface MapComponentProps {
  midpoint: Location;
  locationA?:  Location | null;
  locationB?:  Location | null;
  height?: number;
  onMidpointDrag?: (newLocation: Location) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  midpoint,
  locationA,
  locationB,
  height = 200,
  onMidpointDrag,
}) => {
  const mapRef = useRef<MapView>(null);
  const [region, _setRegion] = useState<Region>({
    latitude: midpoint.latitude,
    longitude: midpoint.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Fit map to show all markers when locations change
  useEffect(() => {
    if (!mapRef.current || !locationA || !locationB) return;

    // Add a small delay to ensure the map is ready
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
