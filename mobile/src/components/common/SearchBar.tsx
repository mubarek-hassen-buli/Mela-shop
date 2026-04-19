import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  /** When false the input is non-interactive — used on Home where the whole bar is a nav button */
  editable?: boolean;
  /** Override the outer container style — useful when embedding in a custom row */
  style?: ViewStyle;
}

/**
 * Rounded search input with an optional filter icon button.
 * Uses a light-gray fill that blends with the iOS-glass aesthetic.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search here...',
  value,
  onChangeText,
  onFilterPress,
  showFilter = true,
  editable = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Input field */}
      <View style={styles.inputContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.text.tertiary} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          style={styles.input}
        />
      </View>

      {/* Filter button */}
      {showFilter && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={22} color={COLORS.black} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    padding: 0,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
