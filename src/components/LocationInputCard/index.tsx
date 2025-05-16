import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Shadows } from '../../styles/theme';

interface LocationInputCardProps {
  title: string;
  children: React.ReactNode;
}

const LocationInputCard: React.FC<LocationInputCardProps> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.m,
  },
  title: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    ...Shadows.small,
    overflow: 'hidden',
  },
});

export default LocationInputCard;
