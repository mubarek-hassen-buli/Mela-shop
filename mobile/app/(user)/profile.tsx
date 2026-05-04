import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileMenuItem } from '@/components/profile/ProfileMenuItem';
import { useAuthStore } from '@/store/auth.store';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { COLORS } from '@/constants/colors';

/**
 * Profile screen — displays the authenticated user's avatar, name,
 * email and a list of settings/navigation items.
 *
 * Data source: useCurrentUser() (TanStack Query + Zustand store)
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { role, clearAuth } = useAuthStore();
  const { user, isLoading } = useCurrentUser();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          clearAuth();
          router.replace('/(auth)/onboarding');
        },
      },
    ]);
  }, [signOut, clearAuth, router]);

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
            onEditAvatar={() => router.push('/(user)/edit-profile')}
            onMorePress={() => {}}
          />
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Menu items */}
        <ProfileMenuItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => router.push('/(user)/edit-profile')}
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
          onPress={() => router.push('/(user)/privacy-policy')}
        />

        <ProfileMenuItem
          icon="help-circle-outline"
          label="Help Center"
          onPress={() => router.push('/(user)/help-center')}
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
          onPress={handleLogout}
        >
          <View style={styles.logoutIconWrapper}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
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
