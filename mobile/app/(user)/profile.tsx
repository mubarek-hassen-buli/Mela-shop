import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileMenuItem } from '@/components/profile/ProfileMenuItem';
import { COLORS } from '@/constants/colors';

/**
 * Profile screen — displays the user avatar, name, phone number and
 * a scrollable list of settings/navigation items (Edit Profile, Address,
 * Notifications, Payment, Security, Language, Dark Mode, Privacy, Help,
 * Invite Friends, Logout).
 */
export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header section: avatar + name + phone */}
        <ProfileHeader
          avatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
          fullName="Andrew Ainsley"
          phoneNumber="+1 111 467 378 399"
          onEditAvatar={() => {}}
          onMorePress={() => {}}
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Menu items */}
        <ProfileMenuItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="location-outline"
          label="Address"
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="notifications-outline"
          label="Notification"
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="card-outline"
          label="Payment"
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="shield-checkmark-outline"
          label="Security"
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="language-outline"
          label="Language"
          trailingText="English (US)"
          onPress={() => {}}
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
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="help-circle-outline"
          label="Help Center"
          onPress={() => {}}
        />

        <ProfileMenuItem
          icon="people-outline"
          label="Invite Friends"
          onPress={() => {}}
        />

        {/* Logout button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.6}
          onPress={() => {}}
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
