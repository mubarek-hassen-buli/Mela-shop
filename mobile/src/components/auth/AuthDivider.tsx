import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

/**
 * "— or —" visual divider between primary and OAuth sign-in options.
 */
export const AuthDivider: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.line} />
    <Text style={styles.label}>or</Text>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    fontWeight: '500',
  },
});
