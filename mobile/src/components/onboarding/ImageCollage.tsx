import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ONBOARDING_COLUMNS } from '@/constants/mockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

const CARD_GAP = 10;
const ROTATION = '-15deg';

/**
 * Tilted 3-column grid of fashion model photos for the onboarding
 * screen top section. The entire grid is rotated and oversized so
 * that cards bleed off every edge, creating the collage effect.
 */
export const ImageCollage: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rotatedGrid}>
        {ONBOARDING_COLUMNS.map((column, colIdx) => (
          <View key={colIdx} style={styles.column}>
            {column.map((uri, imgIdx) => (
              <View key={imgIdx} style={styles.imageCard}>
                <Image
                  source={{ uri }}
                  style={styles.image}
                  contentFit="cover"
                  transition={300}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT * 0.62,
    overflow: 'hidden',
    backgroundColor: '#EFEFEF',
  },
  rotatedGrid: {
    flexDirection: 'row',
    gap: CARD_GAP,
    transform: [{ rotate: ROTATION }],
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.08,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_HEIGHT * 0.78,
    paddingHorizontal: CARD_GAP,
  },
  column: {
    flex: 1,
    gap: CARD_GAP,
  },
  imageCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
