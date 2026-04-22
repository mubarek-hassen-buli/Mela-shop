import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { COLORS } from '@/constants/colors';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  avatarUrl?: string;
  /** ISO date string */
  joinedAt: string;
  isActive: boolean;
}

interface UserRowProps {
  user: AdminUser;
  onPress: () => void;
}

/**
 * Single row in the admin user list.
 * Shows avatar, name, email, role badge, and a chevron.
 */
export const UserRow: React.FC<UserRowProps> = ({ user, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    {/* Avatar */}
    <View style={styles.avatarWrapper}>
      {user.avatarUrl ? (
        <Image
          source={{ uri: user.avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={20} color={COLORS.text.tertiary} />
        </View>
      )}
      {/* Active status dot */}
      {user.isActive && <View style={styles.activeDot} />}
    </View>

    {/* Name + email */}
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>
        {user.fullName}
      </Text>
      <Text style={styles.email} numberOfLines={1}>
        {user.email}
      </Text>
    </View>

    {/* Role badge */}
    <RoleBadge role={user.role} />

    {/* Chevron */}
    <Ionicons
      name="chevron-forward"
      size={16}
      color={COLORS.text.tertiary}
      style={styles.chevron}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
  chevron: {
    flexShrink: 0,
  },
});
