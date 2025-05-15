import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Shadows } from '../styles/theme';

interface CategoryChipsProps {
  categories: string[];
  selectedCategories: Set<string>;
  onToggleCategory: (category: string) => void;
  onReset?: () => void;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
  onReset,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.chipContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.chip,
              selectedCategories.has(category) && styles.chipSelected
            ]}
            onPress={() => onToggleCategory(category)}
          >
            <Text 
              style={[
                styles.chipText,
                selectedCategories.has(category) && styles.chipTextSelected
              ]}
            >
              {category.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
        
        {onReset && (
          <TouchableOpacity
            style={styles.chip}
            onPress={onReset}
          >
            <Text style={styles.chipText}>Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.m,
  },
  title: {
    ...Typography.subtitle,
    marginBottom: Spacing.s,
  },
  scrollView: {
    flexGrow: 0,
  },
  chipContainer: {
    paddingVertical: Spacing.xs,
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
    ...Typography.small,
    color: Colors.chipText,
  },
  chipTextSelected: {
    color: Colors.chipTextSelected,
  },
});

export default CategoryChips;
