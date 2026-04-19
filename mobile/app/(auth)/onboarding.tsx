import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ImageCollage } from '@/components/onboarding/ImageCollage';
import { OnboardingContent } from '@/components/onboarding/OnboardingContent';

/**
 * Onboarding screen — full-bleed image collage on top with a curved
 * white content sheet pinned to the bottom.
 */
export default function OnboardingScreen() {
  return (
    <View style={styles.screen}>
      <ImageCollage />
      <View style={styles.contentWrapper}>
        <OnboardingContent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  contentWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
