import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryChips } from '@/components/home/CategoryChips';
import { ProductCard } from '@/components/home/ProductCard';
import { SortFilterModal, type FilterState } from '@/components/search/SortFilterModal';
import { Ionicons } from '@expo/vector-icons';
import { SEARCH_PRODUCTS, PRODUCTS, CATEGORIES } from '@/constants/mockData';
import { COLORS } from '@/constants/colors';
import type { Product } from '@/types';

/**
 * Search screen — back button + search bar + filter in the header,
 * followed by category chips and a 2-column product grid.
 * Defaults to the "Jackets" category on entry.
 */
export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('2'); // Jackets
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    priceMin: 100,
    priceMax: 650,
    sortBy: 'Most Recent',
    rating: 'All',
  });

  /* Combine all products and filter by active category + search query */
  const allProducts: Product[] = [...PRODUCTS, ...SEARCH_PRODUCTS];

  const activeSlug =
    CATEGORIES.find((c) => c.id === activeCategoryId)?.slug ?? '';

  const filteredProducts = allProducts.filter((p) => {
    const matchesCategory = activeSlug ? p.category === activeSlug : true;
    const matchesQuery = searchQuery.trim()
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesPrice = p.price >= filters.priceMin && p.price <= filters.priceMax;
    return matchesCategory && matchesQuery && matchesPrice;
  });

  /* Sort */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'Price High') return b.price - a.price;
    if (filters.sortBy === 'Price Low') return a.price - b.price;
    return 0; // Popular / Most Recent — keep original order
  });

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);

    // If a specific category was chosen in the modal, try to sync chips
    if (newFilters.category !== 'All') {
      const matched = CATEGORIES.find(
        (c) => c.name.toLowerCase() === newFilters.category.toLowerCase(),
      );
      if (matched) setActiveCategoryId(matched.id);
    }
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      {/* Header row: back + search + filter */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>

        <SearchBar
          placeholder="Search here..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          showFilter={true}
          onFilterPress={() => setFilterModalVisible(true)}
          style={styles.searchBar}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category chips — controlled so we can read the active id */}
        <CategoryChips
          activeId={activeCategoryId}
          onSelect={setActiveCategoryId}
        />

        {/* Section title */}
        <Text style={styles.sectionTitle}>Top Sellers</Text>

        {/* 2-column product grid */}
        {sortedProducts.length > 0 ? (
          <View style={styles.productGrid}>
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        )}
      </ScrollView>

      {/* Sort & Filter Modal */}
      <SortFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 0,
    paddingVertical: 10,
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.text.tertiary,
  },
});
