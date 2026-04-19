import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

/**
 * Horizontal row of circular size pills. The active pill flips to
 * a dark background with white text.
 */
export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Size</Text>
      <View style={styles.row}>
        {sizes.map((size) => {
          const isActive = size === selectedSize;
          return (
            <TouchableOpacity
              key={size}
              onPress={() => onSelect(size)}
              activeOpacity={0.7}
              style={[styles.pill, isActive && styles.pillActive]}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {size}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const PILL_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    width: PILL_SIZE,
    height: PILL_SIZE,
    borderRadius: PILL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  pillActive: {
    backgroundColor: COLORS.black,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  pillTextActive: {
    color: COLORS.white,
  },
});
