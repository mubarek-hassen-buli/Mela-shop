import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface StatCardProps {
  /** Metric label */
  label: string;
  /** Main value to display */
  value: string | number;
  /** Leading icon */
  icon: IoniconsName;
  /** Optional percentage change string e.g. "+12%" */
  change?: string;
  /** Whether the change is positive (green) or negative (red) */
  changePositive?: boolean;
  /** Accent background colour for the icon badge */
  iconBg?: string;
}

/**
 * Admin KPI stat card — shows a metric value, label, icon, and
 * an optional percentage change indicator.
 */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  changePositive = true,
  iconBg = COLORS.black,
}) => (
  <View style={styles.card}>
    {/* Icon badge */}
    <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={22} color={COLORS.white} />
    </View>

    {/* Value */}
    <Text style={styles.value}>{value}</Text>

    {/* Label */}
    <Text style={styles.label}>{label}</Text>

    {/* Change indicator */}
    {!!change && (
      <View style={styles.changeRow}>
        <Ionicons
          name={changePositive ? 'trending-up' : 'trending-down'}
          size={13}
          color={changePositive ? COLORS.success : COLORS.error}
        />
        <Text
          style={[
            styles.changeText,
            { color: changePositive ? COLORS.success : COLORS.error },
          ]}
        >
          {change}
        </Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    padding: 16,
    minWidth: '45%',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
