import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { BANNER } from '@/constants/mockData';

/**
 * Promotional banner card — winter-mountain background on the left
 * with sale copy + CTA, and two model photos stacked on the right.
 */
export const PromoBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Background image */}
      <Image
        source={{ uri: BANNER.backgroundImage }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />

      {/* Gradient overlay for text readability */}
      <LinearGradient
        colors={['rgba(80, 130, 180, 0.75)', 'rgba(120, 160, 200, 0.35)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.contentRow}>
        {/* Left — Text + CTA */}
        <View style={styles.textContent}>
          <Text style={styles.bannerTitle}>{BANNER.title}</Text>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
            <Text style={styles.ctaText}>{BANNER.buttonText}</Text>
          </TouchableOpacity>
        </View>

        {/* Right — Model images */}
        <View style={styles.modelContainer}>
          {BANNER.modelImages.map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={[styles.modelImage, idx === 1 && styles.modelOffset]}
              contentFit="cover"
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: 170,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 8,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 28,
    marginBottom: 14,
  },
  ctaButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.black,
  },
  modelContainer: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 8,
    gap: 4,
  },
  modelImage: {
    width: 80,
    height: 140,
    borderRadius: 12,
  },
  modelOffset: {
    marginBottom: 12,
  },
});
