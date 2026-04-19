import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { COLORS } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Reusable pill-shaped button with three visual variants.
 * Primary = solid dark, Outline = bordered, Ghost = transparent.
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  style,
}) => {
  const buttonVariant = VARIANT_STYLES[variant];
  const buttonSize = SIZE_STYLES[size];
  const textVariant = TEXT_VARIANT_STYLES[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        buttonVariant,
        buttonSize,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.white : COLORS.black}
        />
      ) : (
        <Text style={[styles.textBase, textVariant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

/* --------------- Styles --------------- */

const styles = StyleSheet.create({
  base: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  disabled: { opacity: 0.5 },
  textBase: { fontSize: 16, fontWeight: '600' },
});

const VARIANT_STYLES = StyleSheet.create({
  primary: { backgroundColor: COLORS.black },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  ghost: { backgroundColor: 'transparent' },
});

const TEXT_VARIANT_STYLES = StyleSheet.create({
  primary: { color: COLORS.white },
  outline: { color: COLORS.black },
  ghost: { color: COLORS.black },
});

const SIZE_STYLES = StyleSheet.create({
  sm: { paddingVertical: 10, paddingHorizontal: 20 },
  md: { paddingVertical: 14, paddingHorizontal: 28 },
  lg: { paddingVertical: 18, paddingHorizontal: 32 },
});
