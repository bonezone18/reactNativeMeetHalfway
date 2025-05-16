import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Typography, Spacing } from '../../styles/theme';

interface SortOptionsProps {
  options: Array<{label: string, value: string | number}>;
  selectedOption: string | number;
  onSelectOption: (option: string | number) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  options,
  selectedOption,
  onSelectOption,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sort by:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.chipContainer}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.value.toString()}
            style={[
              styles.chip,
              selectedOption === option.value && styles.chipSelected
            ]}
            onPress={() => onSelectOption(option.value)}
          >
            <Text 
              style={[
                styles.chipText,
                selectedOption === option.value && styles.chipTextSelected
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
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

export default SortOptions;
