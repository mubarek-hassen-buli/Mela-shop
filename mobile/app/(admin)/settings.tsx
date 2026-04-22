import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

/* ──────────────────────────────────────────────────────────── */
/*  Types                                                        */
/* ──────────────────────────────────────────────────────────── */

interface SettingRow {
  id: string;
  label: string;
  description?: string;
  icon: IoniconsName;
  iconBg?: string;
  type: 'toggle' | 'chevron' | 'destructive';
  toggleKey?: keyof ToggleState;
  onPress?: () => void;
}

interface ToggleState {
  maintenanceMode: boolean;
  newRegistrations: boolean;
  reviewEmails: boolean;
  auditLogging: boolean;
  rateLimiting: boolean;
}

/* ──────────────────────────────────────────────────────────── */
/*  Section sub-component                                        */
/* ──────────────────────────────────────────────────────────── */

interface SettingSectionProps {
  title: string;
  rows: SettingRow[];
  toggleState: ToggleState;
  onToggle: (key: keyof ToggleState) => void;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  rows,
  toggleState,
  onToggle,
}) => (
  <View style={sectionStyles.wrapper}>
    <Text style={sectionStyles.title}>{title}</Text>
    <View style={sectionStyles.card}>
      {rows.map((row, idx) => (
        <View key={row.id}>
          <TouchableOpacity
            style={sectionStyles.row}
            onPress={row.type !== 'toggle' ? row.onPress : undefined}
            activeOpacity={row.type !== 'toggle' ? 0.7 : 1}
          >
            <View style={[sectionStyles.iconBadge, { backgroundColor: row.iconBg ?? COLORS.backgroundSecondary }]}>
              <Ionicons
                name={row.icon}
                size={18}
                color={row.type === 'destructive' ? COLORS.error : row.iconBg ? COLORS.white : COLORS.text.secondary}
              />
            </View>
            <View style={sectionStyles.rowText}>
              <Text style={[sectionStyles.label, row.type === 'destructive' && { color: COLORS.error }]}>
                {row.label}
              </Text>
              {!!row.description && (
                <Text style={sectionStyles.description}>{row.description}</Text>
              )}
            </View>
            {row.type === 'toggle' && row.toggleKey && (
              <Switch
                value={toggleState[row.toggleKey]}
                onValueChange={() => onToggle(row.toggleKey!)}
                trackColor={{ false: COLORS.border, true: COLORS.black }}
                thumbColor={COLORS.white}
              />
            )}
            {row.type === 'chevron' && (
              <Ionicons name="chevron-forward" size={16} color={COLORS.text.tertiary} />
            )}
          </TouchableOpacity>
          {idx < rows.length - 1 && <View style={sectionStyles.divider} />}
        </View>
      ))}
    </View>
  </View>
);

const sectionStyles = StyleSheet.create({
  wrapper: { marginBottom: 8 },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 20,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: { flex: 1 },
  label: { fontSize: 15, fontWeight: '500', color: COLORS.text.primary },
  description: { fontSize: 12, color: COLORS.text.tertiary, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 66 },
});

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Admin Settings screen — grouped setting rows with toggles, chevrons,
 * and a destructive clear-data action.
 * Replace toggle handlers with PATCH /settings/... calls.
 */
export default function AdminSettingsScreen() {
  const router = useRouter();

  const [toggles, setToggles] = useState<ToggleState>({
    maintenanceMode: false,
    newRegistrations: true,
    reviewEmails: true,
    auditLogging: true,
    rateLimiting: true,
  });

  const handleToggle = (key: keyof ToggleState) => {
    if (key === 'maintenanceMode') {
      Alert.alert(
        toggles.maintenanceMode ? 'Disable Maintenance Mode?' : 'Enable Maintenance Mode?',
        toggles.maintenanceMode
          ? 'The app will be accessible to all users again.'
          : 'All users will see a maintenance screen until you disable this.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            style: 'destructive',
            onPress: () =>
              setToggles((prev) => ({ ...prev, [key]: !prev[key] })),
          },
        ],
      );
    } else {
      setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const confirmAction = (title: string, message: string, onConfirm: () => void) =>
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onConfirm },
    ]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* ── Nav bar ── */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── App info card ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconWrapper}>
            <Ionicons name="storefront" size={28} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.infoTitle}>Mela Shop</Text>
            <Text style={styles.infoSub}>Admin Panel · v1.0.0</Text>
          </View>
        </View>

        {/* ── App Controls ── */}
        <SettingSection
          title="App Controls"
          toggleState={toggles}
          onToggle={handleToggle}
          rows={[
            {
              id: 'maintenance',
              label: 'Maintenance Mode',
              description: 'Block all users from accessing the app',
              icon: 'construct-outline',
              iconBg: '#D97706',
              type: 'toggle',
              toggleKey: 'maintenanceMode',
            },
            {
              id: 'registrations',
              label: 'Allow New Registrations',
              description: 'Disable to stop accepting new accounts',
              icon: 'person-add-outline',
              iconBg: '#059669',
              type: 'toggle',
              toggleKey: 'newRegistrations',
            },
          ]}
        />

        {/* ── Notifications ── */}
        <SettingSection
          title="Notifications"
          toggleState={toggles}
          onToggle={handleToggle}
          rows={[
            {
              id: 'reviewEmails',
              label: 'Order Review Emails',
              description: 'Auto-send review requests after delivery',
              icon: 'mail-outline',
              iconBg: '#7C3AED',
              type: 'toggle',
              toggleKey: 'reviewEmails',
            },
          ]}
        />

        {/* ── Security ── */}
        <SettingSection
          title="Security"
          toggleState={toggles}
          onToggle={handleToggle}
          rows={[
            {
              id: 'auditLogging',
              label: 'Audit Logging',
              description: 'Log all admin actions for compliance',
              icon: 'document-text-outline',
              iconBg: COLORS.black,
              type: 'toggle',
              toggleKey: 'auditLogging',
            },
            {
              id: 'rateLimiting',
              label: 'API Rate Limiting',
              description: 'Protect endpoints from abuse',
              icon: 'shield-checkmark-outline',
              iconBg: COLORS.black,
              type: 'toggle',
              toggleKey: 'rateLimiting',
            },
          ]}
        />

        {/* ── Data ── */}
        <SettingSection
          title="Data Management"
          toggleState={toggles}
          onToggle={handleToggle}
          rows={[
            {
              id: 'exportUsers',
              label: 'Export User Data',
              description: 'Download all users as a CSV file',
              icon: 'download-outline',
              type: 'chevron',
              onPress: () => Alert.alert('Export', 'This will trigger a CSV export. Coming soon.'),
            },
            {
              id: 'clearCache',
              label: 'Clear App Cache',
              description: 'Reset server-side caches',
              icon: 'trash-outline',
              type: 'chevron',
              onPress: () =>
                confirmAction('Clear Cache?', 'This will clear all server-side caches. The app may be slower temporarily.', () =>
                  Alert.alert('Done', 'Cache cleared successfully.'),
                ),
            },
          ]}
        />

        {/* ── Danger zone ── */}
        <SettingSection
          title="Danger Zone"
          toggleState={toggles}
          onToggle={handleToggle}
          rows={[
            {
              id: 'deleteInactive',
              label: 'Delete Inactive Accounts',
              description: 'Permanently remove all deactivated users',
              icon: 'person-remove-outline',
              type: 'destructive',
              onPress: () =>
                confirmAction(
                  'Delete Inactive Accounts?',
                  'This will permanently delete all deactivated user accounts. This cannot be undone.',
                  () => Alert.alert('Done', 'Inactive accounts have been removed.'),
                ),
            },
          ]}
        />

        {/* ── Version ── */}
        <Text style={styles.versionText}>Mela Shop Admin · Build 1.0.0 · © 2026 Melaverse</Text>
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

  scrollContent: { paddingBottom: 48 },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.black,
    borderRadius: 20,
    padding: 18,
  },
  infoIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  infoSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },

  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.text.tertiary,
    marginTop: 32,
    marginBottom: 8,
  },
});
