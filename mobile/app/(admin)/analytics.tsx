import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 40;

/* ──────────────────────────────────────────────────────────── */
/*  Mock data — replace with GET /analytics/overview            */
/* ──────────────────────────────────────────────────────────── */

const MONTHLY_REVENUE = [
  { month: 'Jan', value: 3200 },
  { month: 'Feb', value: 4800 },
  { month: 'Mar', value: 4100 },
  { month: 'Apr', value: 6200 },
  { month: 'May', value: 5300 },
  { month: 'Jun', value: 7800 },
  { month: 'Jul', value: 6900 },
  { month: 'Aug', value: 8400 },
];

const USER_GROWTH = [
  { month: 'Jan', value: 210 },
  { month: 'Feb', value: 340 },
  { month: 'Mar', value: 280 },
  { month: 'Apr', value: 490 },
  { month: 'May', value: 420 },
  { month: 'Jun', value: 610 },
  { month: 'Jul', value: 580 },
  { month: 'Aug', value: 710 },
];

const TOP_CATEGORIES = [
  { label: 'Hoodies', value: 38, color: COLORS.black },
  { label: 'Jackets', value: 27, color: '#7C3AED' },
  { label: 'Jeans', value: 18, color: '#059669' },
  { label: 'T-Shirts', value: 11, color: '#D97706' },
  { label: 'Others', value: 6, color: '#9CA3AF' },
];

const SUMMARY_CARDS = [
  { label: 'Avg. Order Value', value: '$40.10', icon: 'calculator-outline' as const, change: '+5%', pos: true },
  { label: 'Conversion Rate', value: '3.8%', icon: 'trending-up-outline' as const, change: '+0.4%', pos: true },
  { label: 'Returned Orders', value: '42', icon: 'return-up-back-outline' as const, change: '+3', pos: false },
  { label: 'New This Month', value: '710', icon: 'person-add-outline' as const, change: '+23%', pos: true },
];

type Period = '7d' | '30d' | '90d';

/* ──────────────────────────────────────────────────────────── */
/*  Mini bar chart (pure RN — no third-party chart lib needed)  */
/* ──────────────────────────────────────────────────────────── */

interface BarChartProps {
  data: { month: string; value: number }[];
  color: string;
  label: string;
}

const MiniBarChart: React.FC<BarChartProps> = ({ data, color, label }) => {
  const max = Math.max(...data.map((d) => d.value));
  const BAR_WIDTH = (CHART_WIDTH - 32 - (data.length - 1) * 6) / data.length;

  return (
    <View style={chartStyles.wrapper}>
      <Text style={chartStyles.chartLabel}>{label}</Text>
      <View style={chartStyles.bars}>
        {data.map((d) => (
          <View key={d.month} style={chartStyles.barCol}>
            <View style={chartStyles.barTrack}>
              <View
                style={[
                  chartStyles.bar,
                  {
                    height: `${(d.value / max) * 100}%`,
                    backgroundColor: color,
                    width: BAR_WIDTH,
                  },
                ]}
              />
            </View>
            <Text style={chartStyles.barMonth}>{d.month}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const chartStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  chartLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.secondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 6 },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, justifyContent: 'flex-end', width: '100%' },
  bar: { borderRadius: 6, minHeight: 4 },
  barMonth: { fontSize: 10, color: COLORS.text.tertiary, fontWeight: '600' },
});

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Admin Analytics screen — period picker, revenue bar chart,
 * user growth chart, category breakdown, and summary cards.
 * Replace mock data with GET /analytics/overview responses.
 */
export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('30d');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* ── Nav bar ── */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Analytics</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Period picker ── */}
        <View style={styles.periodRow}>
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodChip, period === p && styles.periodChipActive]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.7}
            >
              <Text style={[styles.periodLabel, period === p && styles.periodLabelActive]}>
                {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Revenue chart ── */}
        <MiniBarChart data={MONTHLY_REVENUE} color={COLORS.black} label="Monthly Revenue ($)" />

        {/* ── User growth chart ── */}
        <MiniBarChart data={USER_GROWTH} color="#7C3AED" label="New Users" />

        {/* ── Category breakdown ── */}
        <Text style={styles.sectionTitle}>Sales by Category</Text>
        <View style={styles.categoryCard}>
          {TOP_CATEGORIES.map((cat) => (
            <View key={cat.label} style={styles.categoryRow}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryName}>{cat.label}</Text>
              <View style={styles.categoryBarTrack}>
                <View style={[styles.categoryBar, { width: `${cat.value}%`, backgroundColor: cat.color }]} />
              </View>
              <Text style={styles.categoryPct}>{cat.value}%</Text>
            </View>
          ))}
        </View>

        {/* ── Summary metric cards ── */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {SUMMARY_CARDS.map((m) => (
            <View key={m.label} style={styles.metricCard}>
              <Ionicons name={m.icon} size={20} color={COLORS.text.secondary} />
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={[styles.metricChange, { color: m.pos ? COLORS.success : COLORS.error }]}>
                {m.pos ? '↑' : '↓'} {m.change}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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

  scrollContent: { padding: 20, paddingBottom: 48 },

  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  periodChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  periodChipActive: { backgroundColor: COLORS.black, borderColor: COLORS.black },
  periodLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text.secondary },
  periodLabelActive: { color: COLORS.white },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 8,
  },

  categoryCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    marginBottom: 12,
  },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoryDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  categoryName: { fontSize: 13, fontWeight: '600', color: COLORS.text.primary, width: 72 },
  categoryBarTrack: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  categoryBar: { height: '100%', borderRadius: 3 },
  categoryPct: { fontSize: 12, fontWeight: '700', color: COLORS.text.secondary, width: 36, textAlign: 'right' },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  metricValue: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary, letterSpacing: -0.4, marginTop: 8 },
  metricLabel: { fontSize: 12, fontWeight: '500', color: COLORS.text.secondary },
  metricChange: { fontSize: 12, fontWeight: '700', marginTop: 6 },
});
