import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ColorSelector } from '@/components/product/ColorSelector';
import { SizeSelector } from '@/components/product/SizeSelector';
import { BottomActionBar } from '@/components/product/BottomActionBar';
import { getProductById } from '@/constants/mockData';
import { COLORS } from '@/constants/colors';
import { useCartStore } from '@/store/useCartStore';

/**
 * Product Detail screen — shows a full gallery, product info,
 * color/size selectors, a description block, and a fixed
 * bottom bar with quantity + Add to Cart.
 */
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const product = getProductById(id ?? '');

  /* ---- local state ---- */
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] ?? '',
  );
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(2);
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite ?? false);

  /* ---- guards ---- */
  if (!product) {
    return (
      <SafeAreaView style={styles.emptyScreen}>
        <Text style={styles.emptyText}>Product not found</Text>
      </SafeAreaView>
    );
  }

  const galleryImages = product.gallery ?? [product.image];
  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.flex}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.black} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Product Details</Text>

          <TouchableOpacity
            onPress={() => setIsFavorite((f) => !f)}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? COLORS.error : COLORS.black}
            />
          </TouchableOpacity>
        </View>

        {/* Scrollable content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ImageGallery images={galleryImages} />

          <ProductInfo
            brand={product.brand}
            name={product.name}
            price={product.price}
          />

          {/* Options row: Color + Size side by side */}
          {(colors.length > 0 || sizes.length > 0) && (
            <View style={styles.optionsRow}>
              {colors.length > 0 && (
                <ColorSelector
                  colors={colors}
                  selectedColor={selectedColor}
                  onSelect={setSelectedColor}
                />
              )}
              {sizes.length > 0 && (
                <SizeSelector
                  sizes={sizes}
                  selectedSize={selectedSize}
                  onSelect={setSelectedSize}
                />
              )}
            </View>
          )}

          {/* Description */}
          {product.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Product Description</Text>
              <Text style={styles.descriptionBody}>
                {product.description}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Fixed bottom action bar */}
      <BottomActionBar
        quantity={quantity}
        onIncrement={() => setQuantity((q) => q + 1)}
        onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
        onAddToCart={() => {
          useCartStore.getState().addItem(product, selectedSize, selectedColor, quantity);
          // Auto route to cart tab after addition
          router.push('/(user)/cart');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  emptyScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },

  /* Scroll */
  scrollContent: {
    paddingBottom: 120,
  },

  /* Options */
  optionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },

  /* Description */
  descriptionSection: {
    paddingHorizontal: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  descriptionBody: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text.secondary,
  },
});
