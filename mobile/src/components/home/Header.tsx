import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

/**
 * Home screen header — hamburger menu (left), brand name (center),
 * notification bell (right). Circular bordered icon buttons.
 */
export const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
        <Ionicons name="menu" size={22} color={COLORS.black} />
      </TouchableOpacity>

      <Text style={styles.brandName}>Mala Shop</Text>

      <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color={COLORS.black}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: -0.3,
  },
});
