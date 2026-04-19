import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import type { CartItem } from '@/store/useCartStore';

interface CartItemCardProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onPress?: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onIncrement,
  onDecrement,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
      {/* Left Thumbnail */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>

      {/* Middle Content */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.subtitle}>
          {item.size} • {item.product.brand}
        </Text>
        <Text style={styles.price}>${item.product.price.toFixed(2)}</Text>
      </View>

      {/* Right Vertical Stepper */}
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={onDecrement}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={16} color={COLORS.black} />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.stepperButton}
          onPress={onIncrement}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
    // Just a very subtle shadow this time
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FAFAFA',
  },
  imageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.text.tertiary,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  stepperContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    width: 40,
    alignItems: 'center',
    paddingVertical: 4,
    marginLeft: 12,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    // Inner minimal shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginVertical: 4,
  },
});
