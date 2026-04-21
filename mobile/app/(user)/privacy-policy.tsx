import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

/* Enable LayoutAnimation on Android */
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ──────────────────────────────────────────────────────────── */
/*  Policy section data                                          */
/* ──────────────────────────────────────────────────────────── */

interface PolicySection {
  id: string;
  title: string;
  body: string;
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: '1',
    title: 'Information We Collect',
    body:
      'We collect information you provide directly — such as your name, email address, phone number, and payment details when you create an account or place an order. We also automatically collect device information, IP addresses, and browsing behaviour within the app to improve your experience.',
  },
  {
    id: '2',
    title: 'How We Use Your Information',
    body:
      'Your information is used to process orders, personalise your shopping experience, send order confirmations and updates, provide customer support, detect and prevent fraud, and improve our products and services. We do not sell your personal data to third parties.',
  },
  {
    id: '3',
    title: 'Sharing Your Information',
    body:
      'We share your data only with trusted service providers who operate under strict confidentiality agreements — for example, payment processors, delivery partners, and cloud infrastructure providers. We may also disclose information if required by law or to protect the rights and safety of our users.',
  },
  {
    id: '4',
    title: 'Data Security',
    body:
      'We implement industry-standard security measures, including TLS encryption for all data in transit and AES-256 encryption for sensitive data at rest. Access to personal data is restricted to authorised personnel on a need-to-know basis. Despite these measures, no system is completely immune to risk.',
  },
  {
    id: '5',
    title: 'Cookies & Tracking',
    body:
      'We use analytics tools to understand how users interact with our app. These tools may collect aggregated, anonymised usage statistics. You can opt out of analytics tracking in your device settings at any time.',
  },
  {
    id: '6',
    title: 'Data Retention',
    body:
      'We retain your personal data for as long as your account is active or as needed to provide services. If you delete your account, we will remove your identifiable data within 30 days, except where we are required to keep it for legal or regulatory purposes.',
  },
  {
    id: '7',
    title: 'Your Rights',
    body:
      'Depending on your location, you may have the right to access, correct, or delete your personal data; object to or restrict certain processing; and receive a portable copy of your data. To exercise any of these rights, contact us at privacy@melashop.com.',
  },
  {
    id: '8',
    title: 'Children\'s Privacy',
    body:
      'Our services are not directed to children under the age of 13. We do not knowingly collect personal information from minors. If you believe a child has provided us with their information, please contact us immediately so we can delete it.',
  },
  {
    id: '9',
    title: 'Changes to This Policy',
    body:
      'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification. Your continued use of the app after changes take effect constitutes acceptance of the updated policy.',
  },
  {
    id: '10',
    title: 'Contact Us',
    body:
      'If you have any questions or concerns about this Privacy Policy, please reach out to our Privacy Team at privacy@melashop.com or write to us at Mela Shop, P.O. Box 12345, Addis Ababa, Ethiopia.',
  },
];

/* ──────────────────────────────────────────────────────────── */
/*  Sub-components                                               */
/* ──────────────────────────────────────────────────────────── */

interface SectionCardProps {
  section: PolicySection;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

const SectionCard: React.FC<SectionCardProps> = ({
  section,
  isExpanded,
  onToggle,
  index,
}) => (
  <TouchableOpacity
    style={styles.sectionCard}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={styles.sectionHeader}>
      {/* Section number badge */}
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>

      <Text style={styles.sectionTitle}>{section.title}</Text>

      <Ionicons
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={18}
        color={COLORS.text.secondary}
      />
    </View>

    {isExpanded && (
      <Text style={styles.sectionBody}>{section.body}</Text>
    )}
  </TouchableOpacity>
);

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Privacy Policy screen — numbered policy sections rendered as an
 * expanding accordion so the user can read only what interests them.
 */
export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const handleToggle = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* ── Nav bar ── */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Privacy Policy</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header card ── */}
        <View style={styles.headerCard}>
          <View style={styles.headerIconWrapper}>
            <Ionicons name="shield-checkmark-outline" size={32} color={COLORS.black} />
          </View>
          <Text style={styles.headerTitle}>Your Privacy Matters</Text>
          <Text style={styles.headerSubtitle}>
            We are committed to protecting your personal information. This policy
            explains what we collect, why we collect it, and how we use it.
          </Text>
          <View style={styles.lastUpdatedRow}>
            <Ionicons name="time-outline" size={14} color={COLORS.text.tertiary} />
            <Text style={styles.lastUpdatedText}>Last updated: April 21, 2026</Text>
          </View>
        </View>

        {/* ── Policy sections ── */}
        {POLICY_SECTIONS.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            index={index}
            isExpanded={expandedId === section.id}
            onToggle={() => handleToggle(section.id)}
          />
        ))}

        {/* ── Footer note ── */}
        <View style={styles.footerNote}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.text.tertiary} />
          <Text style={styles.footerNoteText}>
            By using Mela Shop you agree to this Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  Styles                                                       */
/* ──────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  /* ── Nav bar ── */
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
  navSpacer: {
    width: 44,
    height: 44,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },

  /* ── Scroll ── */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },

  /* ── Header card ── */
  headerCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.black,
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 14,
  },
  lastUpdatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    fontWeight: '500',
  },

  /* ── Section card ── */
  sectionCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    lineHeight: 21,
  },
  sectionBody: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  /* ── Footer note ── */
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  footerNoteText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text.tertiary,
    lineHeight: 18,
  },
});
