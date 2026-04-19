import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAIN_IMAGE_WIDTH = SCREEN_WIDTH * 0.68;
const THUMB_SIZE = (SCREEN_WIDTH - MAIN_IMAGE_WIDTH - 48) ; // remaining space
const GALLERY_HEIGHT = SCREEN_WIDTH * 0.95;

interface ImageGalleryProps {
  images: string[];
}

/**
 * Product image gallery — large main image on the left with a
 * vertical strip of 3 thumbnails on the right. Tapping a thumbnail
 * swaps it into the main view. A small "›" arrow button sits at
 * the bottom-right for horizontal scrolling hint.
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const mainImage = images[activeIndex] ?? images[0];
  const thumbnails = images.filter((_, idx) => idx !== activeIndex).slice(0, 3);

  return (
    <View style={styles.container}>
      {/* Main image */}
      <View style={styles.mainImageWrapper}>
        <Image
          source={{ uri: mainImage }}
          style={styles.mainImage}
          contentFit="cover"
          transition={250}
        />
      </View>

      {/* Thumbnail column */}
      <View style={styles.thumbColumn}>
        {thumbnails.map((uri, idx) => {
          // Map back to the original index in the images array
          const originalIndex = images.indexOf(uri);
          return (
            <TouchableOpacity
              key={uri}
              onPress={() => setActiveIndex(originalIndex)}
              activeOpacity={0.8}
              style={styles.thumbWrapper}
            >
              <Image
                source={{ uri }}
                style={styles.thumbImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          );
        })}

        {/* Forward arrow hint */}
        {images.length > 4 && (
          <TouchableOpacity style={styles.arrowButton} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={18} color={COLORS.black} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    height: GALLERY_HEIGHT,
    marginBottom: 20,
  },
  mainImageWrapper: {
    width: MAIN_IMAGE_WIDTH,
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbColumn: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 8,
  },
  thumbWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
