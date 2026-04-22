import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { type AdminUser } from '@/components/admin/UserRow';
import { COLORS } from '@/constants/colors';

/* ──────────────────────────────────────────────────────────── */
/*  Mock — replace with GET /users/:id                          */
/* ──────────────────────────────────────────────────────────── */

const MOCK_USERS: Record<string, AdminUser & { phone?: string; ordersCount?: number; totalSpent?: string }> = {
  '1': {
    id: '1',
    fullName: 'Andrew Ainsley',
    email: 'andrew.ainsley@email.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    joinedAt: 'January 15, 2024',
    isActive: true,
    phone: '+1 111 467 378',
    ordersCount: 48,
    totalSpent: '$4,210',
  },
  '2': {
    id: '2',
    fullName: 'Sara Ahmed',
    email: 'sara.ahmed@email.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9ea09d4?w=200&h=200&fit=crop&crop=face',
    joinedAt: 'February 3, 2024',
    isActive: true,
    phone: '+251 911 234 567',
    ordersCount: 12,
    totalSpent: '$834',
  },
  '3': {
    id: '3',
    fullName: 'Yonas Tesfaye',
    email: 'yonas.tesfaye@email.com',
    role: 'admin',
    joinedAt: 'January 28, 2024',
    isActive: true,
    ordersCount: 5,
    totalSpent: '$299',
  },
  '4': {
    id: '4',
    fullName: 'Liya Haile',
    email: 'liya.haile@email.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
    joinedAt: 'March 11, 2024',
    isActive: false,
    ordersCount: 3,
    totalSpent: '$145',
  },
};

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Admin User Detail — shows user info, stats, and admin actions:
 * Promote/Demote role, Activate/Deactivate account.
 *
 * Replace MOCK_USERS lookup with GET /users/:id.
 * Wire action handlers to PATCH /users/:id/role and DELETE /users/:id.
 */
export default function AdminUserDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const userFromMock = MOCK_USERS[id] ?? MOCK_USERS['1'];
  const [user, setUser] = useState(userFromMock);
  const [loading, setLoading] = useState(false);

  /* ── Promote / demote ── */
  const handleToggleRole = () => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    Alert.alert(
      user.role === 'admin' ? 'Demote to User?' : 'Promote to Admin?',
      `This will change ${user.fullName}'s role to "${newRole}".`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: user.role === 'admin' ? 'destructive' : 'default',
          onPress: () => {
            setLoading(true);
            // TODO: PATCH /users/:id/role { role: newRole }
            setTimeout(() => {
              setUser((prev) => ({ ...prev, role: newRole }));
              setLoading(false);
            }, 800);
          },
        },
      ],
    );
  };

  /* ── Activate / deactivate ── */
  const handleToggleActive = () => {
    const action = user.isActive ? 'Deactivate' : 'Reactivate';
    Alert.alert(
      `${action} Account?`,
      user.isActive
        ? `${user.fullName} will lose access to the app.`
        : `${user.fullName} will regain access to the app.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          style: user.isActive ? 'destructive' : 'default',
          onPress: () => {
            setLoading(true);
            // TODO: PATCH /users/:id { isActive: !user.isActive }
            setTimeout(() => {
              setUser((prev) => ({ ...prev, isActive: !prev.isActive }));
              setLoading(false);
            }, 800);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* ── Nav bar ── */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>User Detail</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Profile header ── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={COLORS.text.tertiary} />
              </View>
            )}
            {/* Status dot */}
            <View style={[styles.statusDot, user.isActive ? styles.statusActive : styles.statusInactive]} />
          </View>

          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <View style={styles.badgeRow}>
            <RoleBadge role={user.role} />
            <View style={[styles.statusPill, user.isActive ? styles.statusPillActive : styles.statusPillInactive]}>
              <Text style={[styles.statusPillText, user.isActive ? styles.statusPillTextActive : styles.statusPillTextInactive]}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Info section ── */}
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoCard}>
          {[
            { icon: 'mail-outline' as const, label: 'Email', value: user.email },
            { icon: 'call-outline' as const, label: 'Phone', value: user.phone ?? 'Not provided' },
            { icon: 'calendar-outline' as const, label: 'Joined', value: user.joinedAt },
            { icon: 'key-outline' as const, label: 'User ID', value: `#${user.id}` },
          ].map((item, idx, arr) => (
            <View key={item.label}>
              <View style={styles.infoRow}>
                <Ionicons name={item.icon} size={18} color={COLORS.text.secondary} />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              </View>
              {idx < arr.length - 1 && <View style={styles.infoDivider} />}
            </View>
          ))}
        </View>

        {/* ── Stats ── */}
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user.ordersCount ?? 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user.totalSpent ?? '$0'}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user.role}</Text>
            <Text style={styles.statLabel}>Role</Text>
          </View>
        </View>

        {/* ── Admin actions ── */}
        <Text style={styles.sectionTitle}>Admin Actions</Text>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleToggleRole}
          activeOpacity={0.7}
          disabled={loading}
        >
          <View style={styles.actionBtnIcon}>
            <Ionicons
              name={user.role === 'admin' ? 'shield-outline' : 'shield-checkmark-outline'}
              size={22}
              color={COLORS.black}
            />
          </View>
          <View style={styles.actionBtnText}>
            <Text style={styles.actionBtnLabel}>
              {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
            </Text>
            <Text style={styles.actionBtnSub}>
              {user.role === 'admin'
                ? 'Remove admin privileges from this user'
                : 'Grant admin privileges to this user'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.text.tertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, !user.isActive && styles.actionBtnSuccess]}
          onPress={handleToggleActive}
          activeOpacity={0.7}
          disabled={loading}
        >
          <View style={[styles.actionBtnIcon, user.isActive ? styles.actionBtnIconDanger : styles.actionBtnIconSuccessIcon]}>
            <Ionicons
              name={user.isActive ? 'ban-outline' : 'checkmark-circle-outline'}
              size={22}
              color={user.isActive ? COLORS.error : COLORS.success}
            />
          </View>
          <View style={styles.actionBtnText}>
            <Text style={[styles.actionBtnLabel, user.isActive ? { color: COLORS.error } : { color: COLORS.success }]}>
              {user.isActive ? 'Deactivate Account' : 'Reactivate Account'}
            </Text>
            <Text style={styles.actionBtnSub}>
              {user.isActive
                ? 'Block this user from accessing the app'
                : "Restore this user's access to the app"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.text.tertiary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  Styles                                                       */
/* ──────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navSpacer: { width: 44, height: 44 },
  navTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text.primary, letterSpacing: -0.3 },

  scrollContent: { paddingBottom: 48 },

  /* ── Profile header ── */
  profileHeader: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  avatarContainer: { position: 'relative', marginBottom: 14 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: COLORS.white,
  },
  statusActive: { backgroundColor: COLORS.success },
  statusInactive: { backgroundColor: COLORS.error },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary, letterSpacing: -0.4, marginBottom: 4 },
  email: { fontSize: 14, color: COLORS.text.secondary, marginBottom: 14 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  statusPillActive: { backgroundColor: 'rgba(34,197,94,0.12)' },
  statusPillInactive: { backgroundColor: 'rgba(239,68,68,0.10)' },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  statusPillTextActive: { color: COLORS.success },
  statusPillTextInactive: { color: COLORS.error },

  /* ── Section title ── */
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },

  /* ── Info card ── */
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text.tertiary, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '500', color: COLORS.text.primary },
  infoDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: 48 },

  /* ── Stats ── */
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary, letterSpacing: -0.3, marginBottom: 3 },
  statLabel: { fontSize: 12, fontWeight: '500', color: COLORS.text.tertiary },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 14 },

  /* ── Action buttons ── */
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  actionBtnSuccess: { backgroundColor: 'rgba(34,197,94,0.07)' },
  actionBtnIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBtnIconDanger: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.2)',
  },
  actionBtnIconSuccessIcon: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderColor: 'rgba(34,197,94,0.2)',
  },
  actionBtnText: { flex: 1 },
  actionBtnLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text.primary, marginBottom: 2 },
  actionBtnSub: { fontSize: 13, color: COLORS.text.secondary },
});
