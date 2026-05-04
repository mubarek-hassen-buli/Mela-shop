import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileMenuItem } from '@/components/profile/ProfileMenuItem';
import { useAuthStore } from '@/store/auth.store';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLogout } from '@/hooks/useLogout';
import { COLORS } from '@/constants/colors';

/**
 * Profile screen — displays the authenticated user's avatar, name,
 * email and a list of settings/navigation items.
 *
 * Logout is handled by useLogout() which:
 * - clears TanStack Query cache (prevents stale data for next user)
 * - clears Zustand store
 * - calls Clerk signOut()
 * - navigates to onboarding
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { role } = useAuthStore();
  const { user, isLoading, refetch } = useCurrentUser();
  const { confirmLogout, loading: logoutLoading } = useLogout();
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header: avatar + name + email */}
        {isLoading && !user ? (
          <View style={styles.loadingHeader}>
            <ActivityIndicator size="small" color={COLORS.text.secondary} />
          </View>
        ) : (
          <ProfileHeader
            avatarUrl={user?.avatarUrl ?? undefined}
            fullName={user?.fullName ?? 'My Account'}
            email={user?.email ?? ''}
            onEditAvatar={() => router.push('/edit-profile')}
            onMorePress={() => {}}
            onRefresh={refetch}
            isRefreshing={isLoading}
          />
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Menu items */}
        <ProfileMenuItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => router.push('/edit-profile')}
        />

        <ProfileMenuItem
          icon="eye-outline"
          label="Dark Mode"
          isToggle
          toggleValue={isDarkMode}
          onToggleChange={setIsDarkMode}
        />

        <ProfileMenuItem
          icon="lock-closed-outline"
          label="Privacy Policy"
          onPress={() => router.push('/privacy-policy')}
        />

        <ProfileMenuItem
          icon="help-circle-outline"
          label="Help Center"
          onPress={() => router.push('/help-center')}
        />

        {/* Admin shortcut — only visible to admin-role users */}
        {role === 'admin' && (
          <ProfileMenuItem
            icon="shield-checkmark-outline"
            label="Admin Dashboard"
            onPress={() => router.push('/(admin)')}
          />
        )}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.6}
          onPress={confirmLogout}
          disabled={logoutLoading}
        >
          <View style={styles.logoutIconWrapper}>
            {logoutLoading ? (
              <ActivityIndicator size="small" color={COLORS.error} />
            ) : (
              <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
            )}
          </View>
          <Text style={styles.logoutText}>
            {logoutLoading ? 'Signing out…' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 8,
  },
  loadingHeader: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  logoutIconWrapper: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.error,
  },
});
