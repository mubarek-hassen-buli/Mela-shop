import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '@/components/admin/StatCard';
import { COLORS } from '@/constants/colors';

/* ──────────────────────────────────────────────────────────── */
/*  Mock data                                                    */
/* ──────────────────────────────────────────────────────────── */

const OVERVIEW_STATS = [
  {
    id: 'users',
    label: 'Total Users',
    value: '2,841',
    icon: 'people' as const,
    change: '+12%',
    changePositive: true,
    iconBg: COLORS.black,
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: '1,204',
    icon: 'bag-handle' as const,
    change: '+8%',
    changePositive: true,
    iconBg: '#7C3AED',
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: '$48.2K',
    icon: 'cash' as const,
    change: '+23%',
    changePositive: true,
    iconBg: '#059669',
  },
  {
    id: 'products',
    label: 'Products',
    value: '156',
    icon: 'shirt' as const,
    change: '-2%',
    changePositive: false,
    iconBg: '#D97706',
  },
];

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'users',
    label: 'Manage Users',
    icon: 'people-outline',
    route: '/(admin)/users',
    description: 'View, promote and deactivate user accounts',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'bar-chart-outline',
    route: '/(admin)/analytics',
    description: 'App performance and growth metrics',
  },
  {
    id: 'notifications',
    label: 'Broadcast',
    icon: 'megaphone-outline',
    route: '/(admin)/notifications',
    description: 'Send push notifications to all users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings-outline',
    route: '/(admin)/settings',
    description: 'App configuration and system controls',
  },
];

interface RecentActivity {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconBg: string;
  text: string;
  time: string;
}

const RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: '1',
    icon: 'person-add',
    iconBg: '#059669',
    text: 'New user registered: Sara Ahmed',
    time: '2 min ago',
  },
  {
    id: '2',
    icon: 'shield',
    iconBg: COLORS.black,
    text: 'Role promoted: Yonas Tesfaye → Admin',
    time: '14 min ago',
  },
  {
    id: '3',
    icon: 'bag-check',
    iconBg: '#7C3AED',
    text: '12 new orders placed this hour',
    time: '1 hr ago',
  },
  {
    id: '4',
    icon: 'megaphone',
    iconBg: '#D97706',
    text: 'Push broadcast sent to 2,841 users',
    time: '3 hr ago',
  },
  {
    id: '5',
    icon: 'person-remove',
    iconBg: COLORS.error,
    text: 'User deactivated: abebe.kebede@email.com',
    time: '5 hr ago',
  },
];

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Admin Dashboard — overview stats, quick-action cards, and
 * a recent-activity feed. All data is mocked; replace with
 * TanStack Query hooks calling GET /analytics/overview.
 */
export default function AdminDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Dashboard</Text>
          <Text style={styles.subGreeting}>Melaverse Technology</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIcon}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Notifications', 'Coming soon.')}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.black} />
            {/* Unread dot */}
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Welcome card ── */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeTitle}>Welcome back 👋</Text>
            <Text style={styles.welcomeSub}>
              Here's what's happening with your store today.
            </Text>
          </View>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.accent} />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        </View>

        {/* ── Stats grid ── */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {OVERVIEW_STATS.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              changePositive={stat.changePositive}
              iconBg={stat.iconBg}
            />
          ))}
        </View>

        {/* ── Quick actions ── */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => router.push(action.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconWrapper}>
              <Ionicons name={action.icon} size={24} color={COLORS.black} />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionDesc}>{action.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.text.tertiary} />
          </TouchableOpacity>
        ))}

        {/* ── Recent activity ── */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          {RECENT_ACTIVITY.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.activityRow}>
                <View style={[styles.activityIcon, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={16} color={COLORS.white} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityText}>{item.text}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
              {idx < RECENT_ACTIVITY.length - 1 && (
                <View style={styles.activityDivider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  Styles                                                       */
/* ──────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.4,
  },
  subGreeting: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 1,
  },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },

  scrollContent: { paddingBottom: 48 },

  /* ── Welcome card ── */
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.black,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
    borderRadius: 20,
    padding: 20,
  },
  welcomeLeft: { flex: 1 },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(200,255,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(200,255,0,0.3)',
  },
  adminBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },

  /* ── Sections ── */
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

  /* ── Stats grid ── */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    gap: 12,
  },

  /* ── Quick action cards ── */
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: { flex: 1 },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  actionDesc: { fontSize: 13, color: COLORS.text.secondary },

  /* ── Activity feed ── */
  activityCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityInfo: { flex: 1 },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    marginTop: 3,
  },
  activityDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 62,
  },
});
