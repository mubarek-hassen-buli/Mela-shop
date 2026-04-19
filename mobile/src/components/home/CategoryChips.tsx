import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CATEGORIES } from '@/constants/mockData';
import { COLORS } from '@/constants/colors';

interface CategoryChipsProps {
  /** Override the default active category id */
  activeId?: string;
  /** Callback when a chip is selected — if omitted, internal state is used */
  onSelect?: (id: string) => void;
}

/**
 * Horizontally-scrollable category chip list.
 * Active chip has a lime-green (#C8FF00) fill; inactive chips are
 * light-gray with dark text.
 *
 * Supports both controlled (activeId + onSelect) and uncontrolled usage.
 */
export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeId: controlledActiveId,
  onSelect,
}) => {
  const [internalActiveId, setInternalActiveId] = useState('1');

  const activeId = controlledActiveId ?? internalActiveId;

  const handlePress = (id: string) => {
    if (onSelect) {
      onSelect(id);
    } else {
      setInternalActiveId(id);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {CATEGORIES.map((category) => {
        const isActive = category.id === activeId;
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => handlePress(category.id)}
            style={[styles.chip, isActive && styles.chipActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundSecondary,
  },
  chipActive: {
    backgroundColor: COLORS.accent,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  chipTextActive: {
    color: COLORS.black,
    fontWeight: '600',
  },
});
