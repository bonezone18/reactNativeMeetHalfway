import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Typography, Spacing, Shadows } from '../../styles/theme';


interface PlaceCardProps {
  name: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
  distance: number;
  priceLevel?: number | string;
  isOpen?: boolean;
  photoUrl?: string | null;
  onPress: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  name,
  address,
  rating,
  userRatingsTotal,
  distance,
  priceLevel,
  isOpen,
  photoUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        {photoUrl && (
    <Image
      source={{ uri: photoUrl }} 
      style={{ width: 80, height: 80, borderRadius: 6, marginRight: 15 }} 
    />
  )}
      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        {address && <Text style={styles.address}>{address}</Text>}
        
        <View style={styles.detailsRow}>
          {rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({userRatingsTotal || 0})</Text>
            </View>
          )}
          
          <Text style={styles.distance}>{distance.toFixed(1)} km</Text>
          
          {priceLevel !== undefined && (
            <Text style={styles.price}>{"$".repeat(typeof priceLevel === "string" ? parseInt(priceLevel, 10) : priceLevel)}</Text>
          )}
        </View>
        
        {isOpen !== undefined && (
          <Text style={isOpen ? styles.openNow : styles.closedNow}>
            {isOpen ? "Open Now" : "Closed"}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    ...Shadows.small,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs,
  },
  address: {
    ...Typography.caption,
    marginBottom: Spacing.s,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  rating: {
    ...Typography.small,
    color: '#FFC107', // Amber for stars
    fontWeight: 'bold',
    marginRight: Spacing.xs,
  },
  ratingCount: {
    ...Typography.small,
    color: Colors.textTertiary,
  },
  distance: {
    ...Typography.small,
    color: Colors.textTertiary,
    marginRight: Spacing.m,
  },
  price: {
    ...Typography.small,
    color: Colors.textTertiary,
  },
  openNow: {
    ...Typography.small,
    color: Colors.success,
    fontWeight: 'bold',
  },
  closedNow: {
    ...Typography.small,
    color: Colors.error,
  },
});

export default PlaceCard;
