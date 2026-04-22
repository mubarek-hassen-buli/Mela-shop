import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserRow, type AdminUser } from '@/components/admin/UserRow';
import { COLORS } from '@/constants/colors';

/* ──────────────────────────────────────────────────────────── */
/*  Mock data — replace with GET /users (admin only)            */
/* ──────────────────────────────────────────────────────────── */

const MOCK_USERS: AdminUser[] = [
  {
    id: '1',
    fullName: 'Andrew Ainsley',
    email: 'andrew.ainsley@email.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2024-01-15',
    isActive: true,
  },
  {
    id: '2',
    fullName: 'Sara Ahmed',
    email: 'sara.ahmed@email.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9ea09d4?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2024-02-03',
    isActive: true,
  },
  {
    id: '3',
    fullName: 'Yonas Tesfaye',
    email: 'yonas.tesfaye@email.com',
    role: 'admin',
    joinedAt: '2024-01-28',
    isActive: true,
  },
  {
    id: '4',
    fullName: 'Liya Haile',
    email: 'liya.haile@email.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2024-03-11',
    isActive: false,
  },
  {
    id: '5',
    fullName: 'Dawit Bekele',
    email: 'dawit.bekele@email.com',
    role: 'user',
    joinedAt: '2024-03-20',
    isActive: true,
  },
  {
    id: '6',
    fullName: 'Hana Girma',
    email: 'hana.girma@email.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2024-04-01',
    isActive: true,
  },
  {
    id: '7',
    fullName: 'Biruk Alemu',
    email: 'biruk.alemu@email.com',
    role: 'user',
    joinedAt: '2024-04-10',
    isActive: true,
  },
  {
    id: '8',
    fullName: 'Tigist Worku',
    email: 'tigist.worku@email.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2024-04-18',
    isActive: false,
  },
];

type FilterType = 'all' | 'admin' | 'user' | 'inactive';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'admin', label: 'Admin' },
  { key: 'user', label: 'Users' },
  { key: 'inactive', label: 'Inactive' },
];

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Admin User List — search + filter + list of all users.
 * Navigates to the user detail screen on row tap.
 * Replace MOCK_USERS with GET /users (admin-only endpoint).
 */
export default function AdminUsersScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filtered = MOCK_USERS.filter((u) => {
    const matchesQuery =
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'inactive' && !u.isActive) ||
      (activeFilter !== 'inactive' && u.role === activeFilter && u.isActive);

    return matchesQuery && matchesFilter;
  });

  const handleUserPress = useCallback(
    (userId: string) => {
      router.push(`/(admin)/users/${userId}` as any);
    },
    [router],
  );

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
        <Text style={styles.navTitle}>Manage Users</Text>
        <View style={styles.navSpacer} />
      </View>

      {/* ── Summary row ── */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryValue}>{MOCK_USERS.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryValue}>
            {MOCK_USERS.filter((u) => u.role === 'admin').length}
          </Text>
          <Text style={styles.summaryLabel}>Admins</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryValue}>
            {MOCK_USERS.filter((u) => u.isActive).length}
          </Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryValue, { color: COLORS.error }]}>
            {MOCK_USERS.filter((u) => !u.isActive).length}
          </Text>
          <Text style={styles.summaryLabel}>Inactive</Text>
        </View>
      </View>

      {/* ── Search bar ── */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color={COLORS.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name or email…"
          placeholderTextColor={COLORS.text.tertiary}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {!!query && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={COLORS.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Filter chips ── */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.filterLabel, activeFilter === f.key && styles.filterLabelActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserRow user={item} onPress={() => handleUserPress(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={COLORS.text.tertiary} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : undefined}
      />
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
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },

  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  summaryChip: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.text.tertiary,
    marginTop: 2,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 14,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  searchIcon: { flexShrink: 0 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    padding: 0,
  },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  filterLabelActive: {
    color: COLORS.white,
  },

  emptyContainer: { flex: 1 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.tertiary,
  },
});
