import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

type Role = 'admin' | 'user';

interface RoleBadgeProps {
  role: Role;
}

/**
 * Small pill badge showing the user's role.
 * Admin → black background with lime accent text.
 * User → light grey background with secondary text.
 */
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const isAdmin = role === 'admin';
  return (
    <View style={[styles.badge, isAdmin ? styles.adminBadge : styles.userBadge]}>
      <Text style={[styles.label, isAdmin ? styles.adminLabel : styles.userLabel]}>
        {isAdmin ? 'Admin' : 'User'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  adminBadge: {
    backgroundColor: COLORS.black,
  },
  userBadge: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  adminLabel: {
    color: COLORS.accent,
  },
  userLabel: {
    color: COLORS.text.secondary,
  },
});
