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
/*  FAQ data                                                     */
/* ──────────────────────────────────────────────────────────── */

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'How do I place an order?',
    answer:
      'Browse the shop, tap any product to open its detail page, choose your size and colour, then tap "Add to Cart". When ready, go to your Cart and tap "Checkout" to complete your purchase.',
  },
  {
    id: '2',
    question: 'Can I track my order?',
    answer:
      'Yes. After placing an order you will receive a confirmation email with a tracking number. You can also visit "My Orders" in your profile to see real-time delivery status.',
  },
  {
    id: '3',
    question: 'What is your return policy?',
    answer:
      'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging. Start a return from the "My Orders" screen — we will email you a pre-paid return label.',
  },
  {
    id: '4',
    question: 'How do I change or cancel my order?',
    answer:
      'Orders can be modified or cancelled within 1 hour of placement. After that, the order enters fulfilment and cannot be changed. Contact our support team as soon as possible if you need help.',
  },
  {
    id: '5',
    question: 'Which payment methods are accepted?',
    answer:
      'We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay. All transactions are encrypted and processed securely.',
  },
  {
    id: '6',
    question: 'How do I update my account details?',
    answer:
      'Go to Profile → Edit Profile to update your name, username, or phone number. Your email address is managed by your sign-in provider and cannot be changed inside the app.',
  },
  {
    id: '7',
    question: 'How do I reset my password?',
    answer:
      'On the Sign In screen, tap "Forgot password?" and enter your email address. You will receive a reset link within a few minutes. Check your spam folder if it does not arrive.',
  },
];

/* ──────────────────────────────────────────────────────────── */
/*  Contact card data                                            */
/* ──────────────────────────────────────────────────────────── */

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface ContactOption {
  id: string;
  icon: IoniconsName;
  label: string;
  value: string;
}

const CONTACT_OPTIONS: ContactOption[] = [
  { id: 'email', icon: 'mail-outline', label: 'Email Us', value: 'support@melashop.com' },
  { id: 'chat', icon: 'chatbubble-ellipses-outline', label: 'Live Chat', value: 'Available 9 am – 6 pm' },
  { id: 'phone', icon: 'call-outline', label: 'Call Us', value: '+1 800 000 0000' },
];

/* ──────────────────────────────────────────────────────────── */
/*  Sub-components                                               */
/* ──────────────────────────────────────────────────────────── */

interface AccordionItemProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isExpanded, onToggle }) => (
  <TouchableOpacity
    style={styles.accordionCard}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={styles.accordionHeader}>
      <Text style={styles.accordionQuestion}>{item.question}</Text>
      <Ionicons
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={18}
        color={COLORS.text.secondary}
      />
    </View>

    {isExpanded && (
      <Text style={styles.accordionAnswer}>{item.answer}</Text>
    )}
  </TouchableOpacity>
);

const ContactCard: React.FC<{ option: ContactOption }> = ({ option }) => (
  <View style={styles.contactCard}>
    <View style={styles.contactIconWrapper}>
      <Ionicons name={option.icon} size={22} color={COLORS.black} />
    </View>
    <View style={styles.contactTextWrapper}>
      <Text style={styles.contactLabel}>{option.label}</Text>
      <Text style={styles.contactValue}>{option.value}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={COLORS.text.tertiary} />
  </View>
);

/* ──────────────────────────────────────────────────────────── */
/*  Screen                                                       */
/* ──────────────────────────────────────────────────────────── */

/**
 * Help Center screen — FAQ accordion and contact options.
 */
export default function HelpCenterScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        <Text style={styles.navTitle}>Help Center</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrapper}>
            <Ionicons name="help-buoy-outline" size={36} color={COLORS.black} />
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubtitle}>
            Find quick answers below or reach out to our support team.
          </Text>
        </View>

        {/* ── FAQ ── */}
        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isExpanded={expandedId === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}

        {/* ── Contact ── */}
        <Text style={[styles.sectionLabel, { marginTop: 32 }]}>Contact Support</Text>
        {CONTACT_OPTIONS.map((option) => (
          <ContactCard key={option.id} option={option} />
        ))}
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

  /* ── Hero ── */
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.black,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* ── Section label ── */
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  /* ── Accordion ── */
  accordionCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  accordionQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    lineHeight: 21,
  },
  accordionAnswer: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  /* ── Contact cards ── */
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  contactIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactTextWrapper: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
});
