import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/common/Button';
import { COLORS } from '@/constants/colors';

/* ──────────────────────────────────────────────────────────── */
/*  Types & data                                                 */
/* ──────────────────────────────────────────────────────────── */

type Audience = 'all' | 'users' | 'admins';

const AUDIENCE_OPTIONS: { key: Audience; label: string; desc: string; count: string }[] = [
  { key: 'all', label: 'All Users', desc: 'Send to every registered account', count: '2,841' },
  { key: 'users', label: 'Standard Users', desc: 'Exclude admin accounts', count: '2,805' },
  { key: 'admins', label: 'Admins Only', desc: 'Target admin accounts only', count: '36' },
];

interface RecentBroadcast {
  id: string;
  title: string;
  body: string;
  audience: string;
  sentAt: string;
  delivered: string;
}

const RECENT_BROADCASTS: RecentBroadcast[] = [
  {
    id: '1',
    title: 'Flash Sale — 40% Off!',
    body: 'Don\'t miss our biggest winter sale. Shop now before stock runs out.',
    audience: 'All Users',
    sentAt: '3 hours ago',
    delivered: '2,841',
  },
  {
    id: '2',
    title: 'New Collection Arrived',
    body: 'The Spring 2026 collection is now live. Check it out!',
    audience: 'Standard Users',
    sentAt: '2 days ago',
    delivered: '2,805',
  },
  {
    id: '3',
    title: 'Maintenance Notice',
    body: 'The app will be down for 30 minutes on Saturday at 2 AM.',
    audience: 'All Users',
    sentAt: '5 days ago',
    delivered: '2,841',
  },
];

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Broadcast Notifications screen — compose a push notification
 * (title + body + audience) and send to all users.
 * Replace handleSend with POST /notifications/broadcast.
 */
export default function AdminNotificationsScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<Audience>('all');
  const [loading, setLoading] = useState(false);

  const titleFocused = title.length > 0;
  const bodyFocused = body.length > 0;
  const canSend = title.trim().length > 0 && body.trim().length > 0;

  const selectedAudienceInfo = AUDIENCE_OPTIONS.find((o) => o.key === audience)!;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    Alert.alert(
      'Send Broadcast?',
      `"${title.trim()}" will be sent to ${selectedAudienceInfo.count} users.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Now',
          onPress: () => {
            setLoading(true);
            // TODO: POST /notifications/broadcast { title, body, audience }
            setTimeout(() => {
              setLoading(false);
              setTitle('');
              setBody('');
              Alert.alert('Sent!', `Notification delivered to ${selectedAudienceInfo.count} users.`);
            }, 1500);
          },
        },
      ],
    );
  }, [canSend, title, body, selectedAudienceInfo]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* ── Nav bar ── */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Broadcast</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* ── Compose section ── */}
        <View style={styles.composeCard}>
          <View style={styles.composeHeader}>
            <Ionicons name="megaphone" size={20} color={COLORS.black} />
            <Text style={styles.composeTitle}>New Broadcast</Text>
          </View>

          {/* Title */}
          <Text style={styles.fieldLabel}>Notification Title</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Flash Sale — 40% Off!"
              placeholderTextColor={COLORS.text.tertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={60}
              returnKeyType="next"
            />
            <Text style={styles.charCount}>{title.length}/60</Text>
          </View>

          {/* Body */}
          <Text style={styles.fieldLabel}>Message Body</Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your notification message here…"
              placeholderTextColor={COLORS.text.tertiary}
              value={body}
              onChangeText={setBody}
              multiline
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{body.length}/200</Text>
          </View>
        </View>

        {/* ── Audience ── */}
        <Text style={styles.sectionTitle}>Target Audience</Text>
        {AUDIENCE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.audienceRow, audience === opt.key && styles.audienceRowActive]}
            onPress={() => setAudience(opt.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.radioOuter, audience === opt.key && styles.radioOuterActive]}>
              {audience === opt.key && <View style={styles.radioInner} />}
            </View>
            <View style={styles.audienceInfo}>
              <Text style={styles.audienceLabel}>{opt.label}</Text>
              <Text style={styles.audienceDesc}>{opt.desc}</Text>
            </View>
            <View style={styles.audienceCount}>
              <Ionicons name="people" size={14} color={COLORS.text.tertiary} />
              <Text style={styles.audienceCountText}>{opt.count}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* ── Preview card ── */}
        {canSend && (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Ionicons name="phone-portrait-outline" size={14} color={COLORS.text.tertiary} />
              <Text style={styles.previewLabel}>Preview</Text>
            </View>
            <View style={styles.previewNotif}>
              <View style={styles.previewAppIcon}>
                <Ionicons name="storefront" size={16} color={COLORS.white} />
              </View>
              <View style={styles.previewText}>
                <Text style={styles.previewTitle} numberOfLines={1}>{title}</Text>
                <Text style={styles.previewBody} numberOfLines={2}>{body}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Send button ── */}
        <View style={styles.sendWrapper}>
          <Button
            title={`Send to ${selectedAudienceInfo.count} users`}
            onPress={handleSend}
            loading={loading}
          />
        </View>

        {/* ── Recent broadcasts ── */}
        <Text style={styles.sectionTitle}>Recent Broadcasts</Text>
        {RECENT_BROADCASTS.map((b) => (
          <View key={b.id} style={styles.broadcastCard}>
            <View style={styles.broadcastHeader}>
              <Text style={styles.broadcastTitle}>{b.title}</Text>
              <Text style={styles.broadcastTime}>{b.sentAt}</Text>
            </View>
            <Text style={styles.broadcastBody} numberOfLines={2}>{b.body}</Text>
            <View style={styles.broadcastMeta}>
              <View style={styles.broadcastChip}>
                <Ionicons name="people-outline" size={12} color={COLORS.text.tertiary} />
                <Text style={styles.broadcastChipText}>{b.audience}</Text>
              </View>
              <View style={styles.broadcastChip}>
                <Ionicons name="checkmark-circle-outline" size={12} color={COLORS.success} />
                <Text style={[styles.broadcastChipText, { color: COLORS.success }]}>
                  {b.delivered} delivered
                </Text>
              </View>
            </View>
          </View>
        ))}
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

  scrollContent: { padding: 20, paddingBottom: 48 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 20,
  },

  /* ── Compose ── */
  composeCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    padding: 16,
    marginBottom: 4,
  },
  composeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  composeTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text.primary },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  textAreaWrapper: { minHeight: 100 },
  input: { fontSize: 15, color: COLORS.text.primary, padding: 0 },
  textArea: { minHeight: 70 },
  charCount: { fontSize: 11, color: COLORS.text.tertiary, textAlign: 'right', marginTop: 4 },

  /* ── Audience ── */
  audienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  audienceRowActive: { borderColor: COLORS.black, backgroundColor: COLORS.white },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioOuterActive: { borderColor: COLORS.black },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.black },
  audienceInfo: { flex: 1 },
  audienceLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text.primary, marginBottom: 2 },
  audienceDesc: { fontSize: 13, color: COLORS.text.secondary },
  audienceCount: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  audienceCountText: { fontSize: 13, fontWeight: '600', color: COLORS.text.secondary },

  /* ── Preview ── */
  previewCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  previewLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  previewNotif: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    alignItems: 'flex-start',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  previewAppIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  previewText: { flex: 1 },
  previewTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text.primary, marginBottom: 2 },
  previewBody: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 18 },

  /* ── Send ── */
  sendWrapper: { marginTop: 20 },

  /* ── Recent ── */
  broadcastCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  broadcastHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  broadcastTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text.primary, flex: 1 },
  broadcastTime: { fontSize: 12, color: COLORS.text.tertiary },
  broadcastBody: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 18, marginBottom: 10 },
  broadcastMeta: { flexDirection: 'row', gap: 10 },
  broadcastChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  broadcastChipText: { fontSize: 12, fontWeight: '500', color: COLORS.text.tertiary },
});
