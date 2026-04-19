import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { Header } from '@/components/home/Header';
import { SearchBar } from '@/components/common/SearchBar';
import { PromoBanner } from '@/components/home/PromoBanner';
import { CategoryChips } from '@/components/home/CategoryChips';
import { ProductCard } from '@/components/home/ProductCard';
import { PRODUCTS } from '@/constants/mockData';
import { COLORS } from '@/constants/colors';

/**
 * Home screen — the main shop landing page composed of:
 * Header → SearchBar → PromoBanner → CategoryChips → ProductGrid
 */
export default function HomeScreen() {
  return (
    <ScreenWrapper>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SearchBar />
        <PromoBanner />
        <CategoryChips />

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Sellers</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {/* 2-column product grid */}
        <View style={styles.productGrid}>
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, // room for the floating tab bar
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
});
