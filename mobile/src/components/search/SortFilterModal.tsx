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
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import BottomSheet, {
  BottomSheetView,
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
/*  Chip row — wrapping layout, no nested scroll                 */
/* ──────────────────────────────────────────────────────────── */

/**
 * Renders chips in a wrapping flex row.
 * Using flexWrap instead of a horizontal ScrollView avoids all gesture
 * conflicts with the parent BottomSheetScrollView.
 */
const ChipRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.chipRow}>{children}</View>
);

/* ──────────────────────────────────────────────────────────── */
/*  Sort & Filter Bottom Sheet                                   */
/* ──────────────────────────────────────────────────────────── */

/**
 * iOS-style Sort & Filter bottom sheet using @gorhom/bottom-sheet.
 *
 * Architecture notes:
 * - BottomSheetScrollView handles vertical scroll of the whole content.
 * - Chip rows use flexWrap (no nested horizontal ScrollView) to avoid
 *   gesture conflicts that cause the bounce/glitch behaviour.
 * - Action buttons sit inside the scroll content at the bottom so they
 *   are always fully visible regardless of device height.
 */
export const SortFilterModal: React.FC<SortFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const sheetRef = useRef<BottomSheet>(null);

  /* Single snap point at 90 % so all content is comfortably visible */
  const snapPoints = useMemo(() => ['90%'], []);

  /* ── Local filter state ── */
  const [category, setCategory] = useState(
    currentFilters?.category ?? DEFAULT_FILTERS.category,
  );
  const [priceMin, setPriceMin] = useState(
    currentFilters?.priceMin ?? DEFAULT_FILTERS.priceMin,
  );
  const [priceMax, setPriceMax] = useState(
    currentFilters?.priceMax ?? DEFAULT_FILTERS.priceMax,
  );
  const [sortBy, setSortBy] = useState(
    currentFilters?.sortBy ?? DEFAULT_FILTERS.sortBy,
  );
  const [rating, setRating] = useState(
    currentFilters?.rating ?? DEFAULT_FILTERS.rating,
  );

  /* Sync state when parent supplies updated filters */
  useEffect(() => {
    if (currentFilters) {
      setCategory(currentFilters.category);
      setPriceMin(currentFilters.priceMin);
      setPriceMax(currentFilters.priceMax);
      setSortBy(currentFilters.sortBy);
      setRating(currentFilters.rating);
    }
  }, [currentFilters]);

  /* Open / close imperatively when `visible` changes */
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

  /* ── Dimmed backdrop ── */
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
      {/* ── Fixed header: drag handle + title ── */}
      <BottomSheetView style={styles.header}>
        <Text style={styles.title}>Sort & Filter</Text>
      </BottomSheetView>

      {/* ── Scrollable body ── */}
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories */}
        <Text style={styles.sectionLabel}>Categories</Text>
        <ChipRow>
          {FILTER_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              isSelected={category === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </ChipRow>

        {/* Price Range */}
        <Text style={styles.sectionLabel}>Price Range</Text>
        <PriceRangeSlider
          minValue={priceMin}
          maxValue={priceMax}
          onValuesChange={handlePriceChange}
        />

        {/* Sort by */}
        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>Sort by</Text>
        <ChipRow>
          {SORT_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              isSelected={sortBy === opt}
              onPress={() => setSortBy(opt)}
            />
          ))}
        </ChipRow>

        {/* Rating */}
        <Text style={styles.sectionLabel}>Rating</Text>
        <ChipRow>
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
                  style={styles.starIcon}
                />
              }
            />
          ))}
        </ChipRow>

        {/* ── Action buttons inside the scroll so they are never clipped ── */}
        <View style={styles.actionDivider} />
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

        {/* Safe-area bottom padding */}
        <View style={styles.bottomSpacer} />
      </BottomSheetScrollView>
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

  /* ── Fixed header ── */
  header: {
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    paddingTop: 8,
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
  sectionLabelSpaced: {
    marginTop: 28,
  },

  /* ── Chip row — wrapping, no horizontal scroll ── */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  /* ── Individual chip ── */
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
  starIcon: {
    marginRight: 4,
  },

  /* ── Action row (inside scroll, not absolutely positioned) ── */
  actionDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginTop: 28,
    marginBottom: 0,
  },
  actionRow: {
    flexDirection: 'row',
    paddingTop: 16,
    gap: 12,
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
  bottomSpacer: {
    height: 24,
  },
});
