import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface ProductInfoProps {
  brand: string;
  name: string;
  price: number;
}

/**
 * Displays the brand label, product name, and formatted price
 * directly below the image gallery.
 */
export const ProductInfo: React.FC<ProductInfoProps> = ({
  brand,
  name,
  price,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>{brand}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>${price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  brand: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
});
