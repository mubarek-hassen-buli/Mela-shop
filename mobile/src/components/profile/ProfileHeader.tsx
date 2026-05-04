import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface ProfileHeaderProps {
  /** User's avatar URL — falls back to a person icon placeholder */
  avatarUrl?: string;
  /** Full name to display */
  fullName: string;
  /** Email address shown below the name */
  email: string;
  /** Called when the camera/edit badge is pressed */
  onEditAvatar?: () => void;
  /** Called when the "more" button (top-right) is pressed */
  onMorePress?: () => void;
  /** Called when the refresh icon is pressed */
  onRefresh?: () => void;
  /** Whether a refresh is currently in progress */
  isRefreshing?: boolean;
}

/**
 * Top section of the Profile screen — shows the brand logo (left),
 * a "more" button (top-right), the circular user avatar with an
 * edit badge overlay, and the user's name and email.
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarUrl,
  fullName,
  email,
  onEditAvatar,
  onMorePress,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Top row: title + More button */}
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            style={styles.logoBadge}
            activeOpacity={0.7}
            onPress={onRefresh}
            disabled={isRefreshing}
          >
            <Ionicons 
              name="sync-outline" 
              size={18} 
              color={isRefreshing ? COLORS.text.tertiary : COLORS.black} 
            />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          activeOpacity={0.7}
          onPress={onMorePress}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBorder}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color={COLORS.text.tertiary} />
            </View>
          )}
        </View>

        {/* Edit badge */}
        <TouchableOpacity
          style={styles.editBadge}
          activeOpacity={0.7}
          onPress={onEditAvatar}
        >
          <Ionicons name="pencil" size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Name + Email */}
      <Text style={styles.fullName}>{fullName}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: COLORS.border,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundSecondary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  fullName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text.secondary,
  },
});
