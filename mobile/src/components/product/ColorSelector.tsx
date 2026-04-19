import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

/**
 * Row of circular color swatches. The active swatch gets a dark
 * outer ring to indicate selection.
 */
export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Color</Text>
      <View style={styles.row}>
        {colors.map((hex) => {
          const isActive = hex === selectedColor;
          return (
            <TouchableOpacity
              key={hex}
              onPress={() => onSelect(hex)}
              activeOpacity={0.7}
              style={[styles.swatch, isActive && styles.swatchActive]}
            >
              <View style={[styles.swatchInner, { backgroundColor: hex }]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const SWATCH_SIZE = 34;

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
    gap: 10,
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchActive: {
    borderColor: COLORS.black,
  },
  swatchInner: {
    width: SWATCH_SIZE - 8,
    height: SWATCH_SIZE - 8,
    borderRadius: (SWATCH_SIZE - 8) / 2,
  },
});
