import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/common/Button';
import { COLORS } from '@/constants/colors';

/**
 * Bottom sheet that overlaps the image collage — contains the
 * onboarding headline, subtitle, pagination dots, and CTA button.
 */
export const OnboardingContent: React.FC = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/(user)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Change your{'\n'}Perspective In Style
      </Text>

      <Text style={styles.subtitle}>
        Change the quality of your appearance{'\n'}with ecommerce now!
      </Text>

      {/* Pagination dots — second dot is active (elongated) */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.dotInactive]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotInactive]} />
      </View>

      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 28,
    alignItems: 'center',
    // Soft shadow above the sheet
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#1F2937',
  },
});
