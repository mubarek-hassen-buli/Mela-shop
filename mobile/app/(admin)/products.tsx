import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS, SEARCH_PRODUCTS } from '@/constants/mockData';
import type { Product } from '@/types';
import { COLORS } from '@/constants/colors';

/* ──────────────────────────────────────────────────────────── */
/*  Merge all mock products into a single admin catalogue       */
/* ──────────────────────────────────────────────────────────── */

const ALL_PRODUCTS: Product[] = [...PRODUCTS, ...SEARCH_PRODUCTS];

/* ──────────────────────────────────────────────────────────── */
/*  Stock helpers (mock — replace with backend data)            */
/* ──────────────────────────────────────────────────────────── */

/** Deterministic fake stock count based on product id */
function getStock(id: string): number {
  const seed = parseInt(id, 10) || 1;
  return [32, 0, 14, 58, 7, 120, 3, 41][seed % 8];
}

function getStockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: 'Out of Stock', color: COLORS.error };
  if (stock <= 10) return { label: 'Low Stock', color: COLORS.warning };
  return { label: 'In Stock', color: COLORS.success };
}

type FilterType = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'in_stock', label: 'In Stock' },
  { key: 'low_stock', label: 'Low' },
  { key: 'out_of_stock', label: 'Out' },
];

/* ──────────────────────────────────────────────────────────── */
/*  Product row sub-component                                    */
/* ──────────────────────────────────────────────────────────── */

interface ProductRowProps {
  product: Product;
  stock: number;
  onPress: () => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, stock, onPress }) => {
  const status = getStockStatus(stock);
  return (
    <TouchableOpacity style={styles.productRow} onPress={onPress} activeOpacity={0.7}>
      {/* Thumbnail */}
      <Image
        source={{ uri: product.image }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={200}
      />

      {/* Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>
            ${product.price.toFixed(2)}
          </Text>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>
              {product.category ?? 'general'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stock badge + chevron */}
      <View style={styles.productTrailing}>
        <View style={[styles.stockBadge, { backgroundColor: `${status.color}14` }]}>
          <View style={[styles.stockDot, { backgroundColor: status.color }]} />
          <Text style={[styles.stockText, { color: status.color }]}>{stock}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
};

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Admin Products screen — search + stock filter + product list.
 * Uses the existing PRODUCTS + SEARCH_PRODUCTS mock data.
 * Replace with GET /products (admin-only) once the backend is ready.
 */
export default function AdminProductsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filtered = ALL_PRODUCTS.filter((p) => {
    // Search
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      (p.category ?? '').toLowerCase().includes(query.toLowerCase());

    // Stock filter
    const stock = getStock(p.id);
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'in_stock' && stock > 10) ||
      (activeFilter === 'low_stock' && stock > 0 && stock <= 10) ||
      (activeFilter === 'out_of_stock' && stock === 0);

    return matchesQuery && matchesFilter;
  });

  const handleProductPress = useCallback(
    (productId: string) => {
      // TODO: navigate to admin product detail/edit screen
      Alert.alert(
        'Product Actions',
        'What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'View in Shop',
            onPress: () => router.push(`/product/${productId}` as any),
          },
          {
            text: 'Edit Product',
            onPress: () =>
              Alert.alert('Coming Soon', 'Product editing will be available once the backend is integrated.'),
          },
        ],
      );
    },
    [router],
  );

  /* Summary stats */
  const totalProducts = ALL_PRODUCTS.length;
  const inStockCount = ALL_PRODUCTS.filter((p) => getStock(p.id) > 10).length;
  const lowStockCount = ALL_PRODUCTS.filter((p) => {
    const s = getStock(p.id);
    return s > 0 && s <= 10;
  }).length;
  const outOfStockCount = ALL_PRODUCTS.filter((p) => getStock(p.id) === 0).length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* ── Nav bar ── */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Products</Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            Alert.alert('Add Product', 'Product creation will be available once the backend is integrated.')
          }
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {/* ── Summary row ── */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryValue}>{totalProducts}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryValue, { color: COLORS.success }]}>{inStockCount}</Text>
          <Text style={styles.summaryLabel}>In Stock</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryValue, { color: COLORS.warning }]}>{lowStockCount}</Text>
          <Text style={styles.summaryLabel}>Low</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryValue, { color: COLORS.error }]}>{outOfStockCount}</Text>
          <Text style={styles.summaryLabel}>Out</Text>
        </View>
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search-outline"
          size={18}
          color={COLORS.text.tertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products…"
          placeholderTextColor={COLORS.text.tertiary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {!!query && (
          <TouchableOpacity
            onPress={() => setQuery('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={COLORS.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Filter chips ── */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              activeFilter === f.key && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterLabel,
                activeFilter === f.key && styles.filterLabelActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductRow
            product={item}
            stock={getStock(item.id)}
            onPress={() => handleProductPress(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="shirt-outline" size={48} color={COLORS.text.tertiary} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
        contentContainerStyle={
          filtered.length === 0 ? styles.emptyContainer : undefined
        }
      />
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  Styles                                                       */
/* ──────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },

  /* ── Nav bar ── */
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },

  /* ── Summary ── */
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  summaryChip: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.text.tertiary,
    marginTop: 2,
  },

  /* ── Search ── */
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 14,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  searchIcon: { flexShrink: 0 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    padding: 0,
  },

  /* ── Filters ── */
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  filterLabelActive: {
    color: COLORS.white,
  },

  /* ── Product row ── */
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundSecondary,
  },
  productInfo: { flex: 1 },
  productBrand: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  categoryChip: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.text.tertiary,
    textTransform: 'capitalize',
  },
  productTrailing: {
    alignItems: 'flex-end',
    gap: 6,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* ── Empty ── */
  emptyContainer: { flex: 1 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.tertiary,
  },
});
