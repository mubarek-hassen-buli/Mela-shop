import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '@/constants/colors';

interface GoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
}

/**
 * "Continue with Google" OAuth button.
 * Uses the official Google "G" wordmark color palette rendered as a
 * simple SVG-style View so no extra icon font is needed.
 */
export const GoogleButton: React.FC<GoogleButtonProps> = ({
  onPress,
  loading = false,
}) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color={COLORS.text.secondary} />
    ) : (
      <>
        {/* Google "G" logo — four-colour quadrant squares */}
        <View style={styles.googleLogo}>
          <View style={styles.logoRow}>
            <View style={[styles.logoQuadrant, { backgroundColor: '#4285F4' }]} />
            <View style={[styles.logoQuadrant, { backgroundColor: '#34A853' }]} />
          </View>
          <View style={styles.logoRow}>
            <View style={[styles.logoQuadrant, { backgroundColor: '#FBBC05' }]} />
            <View style={[styles.logoQuadrant, { backgroundColor: '#EA4335' }]} />
          </View>
        </View>
        <Text style={styles.label}>Continue with Google</Text>
      </>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 12,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleLogo: {
    width: 20,
    height: 20,
    borderRadius: 2,
    overflow: 'hidden',
    gap: 1,
  },
  logoRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 1,
  },
  logoQuadrant: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
});
