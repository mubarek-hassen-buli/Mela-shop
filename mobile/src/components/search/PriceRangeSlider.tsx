import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { COLORS } from '@/constants/colors';

interface PriceRangeSliderProps {
  minValue: number;
  maxValue: number;
  onValuesChange: (min: number, max: number) => void;
}

/** Custom thumb rendered by MultiSlider */
const CustomThumb: React.FC = () => <View style={styles.thumb} />;

/**
 * Dual-thumb price range slider using @ptomasroos/react-native-multi-slider.
 * Custom-styled to match the project's clean black-and-white aesthetic.
 */
export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minValue,
  maxValue,
  onValuesChange,
}) => {
  const handleChange = useCallback(
    (values: number[]) => {
      onValuesChange(values[0], values[1]);
    },
    [onValuesChange],
  );

  return (
    <View style={styles.container}>
      <MultiSlider
        values={[minValue, maxValue]}
        min={0}
        max={1000}
        step={10}
        onValuesChange={handleChange}
        selectedStyle={styles.selectedTrack}
        unselectedStyle={styles.unselectedTrack}
        containerStyle={styles.sliderContainer}
        trackStyle={styles.track}
        customMarker={CustomThumb}
        sliderLength={280}
        allowOverlap={false}
        snapped
      />

      {/* Price labels */}
      <View style={styles.labelsRow}>
        <Text style={styles.labelText}>${minValue}</Text>
        <Text style={styles.labelText}>${maxValue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  sliderContainer: {
    height: 40,
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  selectedTrack: {
    backgroundColor: COLORS.black,
  },
  unselectedTrack: {
    backgroundColor: COLORS.border,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 2.5,
    borderColor: COLORS.black,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 288,
    marginTop: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
});
