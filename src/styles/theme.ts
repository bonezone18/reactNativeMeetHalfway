import { StyleSheet } from 'react-native';

// Colors extracted from Flutter app
export const Colors = {
  // Primary colors
  primary: '#007AFF', // iOS blue
  secondary: '#4CAF50', // Green
  accent: '#2ECC71', // Emerald green (Meet button)
  
  // UI colors
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  error: '#FF3B30', // iOS red
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#555555',
  textTertiary: '#777777',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9500',
  info: '#007AFF',
  
  // Border colors
  border: '#E0E0E0',
  
  // Chip colors
  chipBackground: '#E0E0E0',
  chipSelected: '#007AFF',
  chipText: '#333333',
  chipTextSelected: '#FFFFFF',
};

// Typography styles
export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold'as const,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold'as const,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  small: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
};

// Spacing constants
export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Shadow styles
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Common styles
export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: Spacing.m,
    ...Shadows.small,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.m,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    backgroundColor: Colors.chipBackground,
    borderRadius: 16,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    marginRight: Spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.chipSelected,
  },
  chipText: {
    color: Colors.chipText,
    fontSize: 13,
  },
  chipTextSelected: {
    color: Colors.chipTextSelected,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: 8,
    alignItems: 'center',
    ...Shadows.small,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'as const,
  },
});

export default {
  Colors,
  Typography,
  Spacing,
  Shadows,
  CommonStyles,
};
