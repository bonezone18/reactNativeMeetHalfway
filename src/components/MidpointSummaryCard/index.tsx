import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Typography, Spacing } from '../../styles/theme';

interface MidpointSummaryCardProps {
  midpoint: {
    name: string;
    address?: string;
  };
  distanceFromA: number;
  distanceFromB: number;
  fairnessLabel: string;
  fairnessDelta: number;
  isLoading?: boolean;
}

const MidpointSummaryCard: React.FC<MidpointSummaryCardProps> = ({
  midpoint,
  distanceFromA,
  distanceFromB,
  fairnessLabel,
  fairnessDelta,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>Calculating midpoint...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculated Midpoint:</Text>
      <Text style={styles.midpointName}>{midpoint.name}</Text>
      
      {midpoint.address && (
        <Text style={styles.midpointAddress}>{midpoint.address}</Text>
      )}
      
      <Text style={styles.fairnessText}>
        Fairness: {fairnessLabel} (Δ {fairnessDelta.toFixed(1)} km)
      </Text>
      
      <View style={styles.distancesContainer}>
        <Text style={styles.distanceText}>
          Distance from A: {distanceFromA.toFixed(1)} km
        </Text>
        <Text style={styles.distanceText}>
          Distance from B: {distanceFromB.toFixed(1)} km
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: Spacing.m,
    marginVertical: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  title: {
    ...Typography.subtitle,
    marginBottom: Spacing.s,
  },
  midpointName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  midpointAddress: {
    ...Typography.caption,
    marginBottom: Spacing.s,
  },
  fairnessText: {
    ...Typography.small,
    fontStyle: 'italic',
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  distancesContainer: {
    marginTop: Spacing.xs,
  },
  distanceText: {
    ...Typography.small,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  loadingText: {
    ...Typography.body,
    marginTop: Spacing.s,
    color: Colors.textSecondary,
  },
});

export default MidpointSummaryCard;
