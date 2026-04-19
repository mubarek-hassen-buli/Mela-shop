import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '@/types';
import { COLORS } from '@/constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
/** Two columns with 16px outer padding and 16px gap between cards */
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

/**
 * Single product card — rounded image container with a translucent
 * heart button, plus brand / name / price below.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {/* Favorite button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={product.isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={product.isFavorite ? COLORS.error : COLORS.text.tertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    paddingHorizontal: 4,
  },
  brand: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
});
