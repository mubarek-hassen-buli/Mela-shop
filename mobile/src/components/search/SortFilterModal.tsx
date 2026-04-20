import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { PriceRangeSlider } from '@/components/search/PriceRangeSlider';

/* ──────────────────────────────────────────────────────────── */
/*  Filter option data                                          */
/* ──────────────────────────────────────────────────────────── */

const FILTER_CATEGORIES = ['All', 'Hoodies', 'Jackets', 'Jeans', 'T-Shirts', 'Shoes'];
const SORT_OPTIONS = ['Popular', 'Most Recent', 'Price High', 'Price Low'];
const RATING_OPTIONS = ['All', '5', '4', '3', '2', '1'];

/* ──────────────────────────────────────────────────────────── */
/*  Types                                                        */
/* ──────────────────────────────────────────────────────────── */

export interface FilterState {
  category: string;
  priceMin: number;
  priceMax: number;
  sortBy: string;
  rating: string;
}

interface SortFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters?: FilterState;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  priceMin: 100,
  priceMax: 650,
  sortBy: 'Most Recent',
  rating: 'All',
};

/* ──────────────────────────────────────────────────────────── */
/*  Chip sub-component                                           */
/* ──────────────────────────────────────────────────────────── */

interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}

const Chip: React.FC<ChipProps> = ({ label, isSelected, onPress, icon }) => (
  <TouchableOpacity
    style={[styles.chip, isSelected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icon}
    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

/* ──────────────────────────────────────────────────────────── */
/*  Sort & Filter Bottom Sheet                                   */
/* ──────────────────────────────────────────────────────────── */

/**
 * iOS-style Sort & Filter bottom sheet powered by @gorhom/bottom-sheet.
 * Features spring animations, a dimmed backdrop, and smooth gesture
 * dismiss. Contains: Categories, Price Range slider, Sort-by,
 * Rating, and Reset / Apply action buttons.
 */
export const SortFilterModal: React.FC<SortFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['72%'], []);

  // Local filter state
  const [category, setCategory] = useState(currentFilters?.category ?? DEFAULT_FILTERS.category);
  const [priceMin, setPriceMin] = useState(currentFilters?.priceMin ?? DEFAULT_FILTERS.priceMin);
  const [priceMax, setPriceMax] = useState(currentFilters?.priceMax ?? DEFAULT_FILTERS.priceMax);
  const [sortBy, setSortBy] = useState(currentFilters?.sortBy ?? DEFAULT_FILTERS.sortBy);
  const [rating, setRating] = useState(currentFilters?.rating ?? DEFAULT_FILTERS.rating);

  /* Sync when parent supplies new filters */
  useEffect(() => {
    if (currentFilters) {
      setCategory(currentFilters.category);
      setPriceMin(currentFilters.priceMin);
      setPriceMax(currentFilters.priceMax);
      setSortBy(currentFilters.sortBy);
      setRating(currentFilters.rating);
    }
  }, [currentFilters]);

  /* Open / close the sheet when `visible` changes */
  useEffect(() => {
    if (visible) {
      sheetRef.current?.snapToIndex(0);
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  /* ── Callbacks ── */
  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );

  const handleReset = useCallback(() => {
    setCategory(DEFAULT_FILTERS.category);
    setPriceMin(DEFAULT_FILTERS.priceMin);
    setPriceMax(DEFAULT_FILTERS.priceMax);
    setSortBy(DEFAULT_FILTERS.sortBy);
    setRating(DEFAULT_FILTERS.rating);
  }, []);

  const handleApply = useCallback(() => {
    onApply({ category, priceMin, priceMax, sortBy, rating });
    onClose();
  }, [category, priceMin, priceMax, sortBy, rating, onApply, onClose]);

  const handlePriceChange = useCallback((min: number, max: number) => {
    setPriceMin(min);
    setPriceMax(max);
  }, []);

  /* ── Backdrop ── */
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.sheetBackground}
    >
      {/* Fixed title inside the sheet (outside scroll) */}
      <Text style={styles.title}>Sort & Filter</Text>

      {/* Scrollable section content */}
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Categories ── */}
        <Text style={styles.sectionLabel}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {FILTER_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              isSelected={category === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* ── Price Range ── */}
        <Text style={styles.sectionLabel}>Price Range</Text>
        <PriceRangeSlider
          minValue={priceMin}
          maxValue={priceMax}
          onValuesChange={handlePriceChange}
        />

        {/* ── Sort by ── */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Sort by</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {SORT_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              isSelected={sortBy === opt}
              onPress={() => setSortBy(opt)}
            />
          ))}
        </ScrollView>

        {/* ── Rating ── */}
        <Text style={styles.sectionLabel}>Rating</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {RATING_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              isSelected={rating === opt}
              onPress={() => setRating(opt)}
              icon={
                <Ionicons
                  name="star"
                  size={13}
                  color={rating === opt ? COLORS.white : COLORS.black}
                  style={{ marginRight: 4 }}
                />
              }
            />
          ))}
        </ScrollView>

        {/* Bottom padding so content clears the action buttons */}
        <View style={{ height: 100 }} />
      </BottomSheetScrollView>

      {/* ── Fixed action row at the bottom ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

/* ──────────────────────────────────────────────────────────── */
/*  Styles                                                       */
/* ──────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  /* ── Sheet chrome ── */
  sheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handle: {
    paddingTop: 12,
    paddingBottom: 0,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },

  /* ── Title ── */
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 20,
    letterSpacing: -0.3,
  },

  /* ── Scroll content ── */
  scrollContent: {
    paddingHorizontal: 24,
  },

  /* ── Section labels ── */
  sectionLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 14,
    marginTop: 20,
  },

  /* ── Chip row ── */
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
  },

  /* ── Chips ── */
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipSelected: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  chipTextSelected: {
    color: COLORS.white,
  },

  /* ── Action buttons ── */
  actionRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 34,
    gap: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
