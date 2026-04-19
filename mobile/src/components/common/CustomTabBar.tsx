import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  type LayoutChangeEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

/** Icon + label config for each tab route */
const TAB_CONFIG: Record<
  string,
  {
    label: string;
    outline: IoniconsName;
    filled: IoniconsName;
    /** Desired bubble width when this tab is active */
    bubbleWidth: number;
  }
> = {
  index: { label: 'Home', outline: 'home-outline', filled: 'home', bubbleWidth: 90 },
  categories: {
    label: 'Categories',
    outline: 'pricetag-outline',
    filled: 'pricetag',
    bubbleWidth: 135,
  },
  cart: {
    label: 'Cart',
    outline: 'bag-handle-outline',
    filled: 'bag-handle',
    bubbleWidth: 85,
  },
  profile: { label: 'Profile', outline: 'person-outline', filled: 'person', bubbleWidth: 100 },
};

/** Spring config — snappy but organic, like a water bubble */
const SPRING_CONFIG = {
  damping: 17,
  stiffness: 150,
  mass: 0.8,
};

/** Inset so the bubble doesn't kiss the edges of each tab slot */
const BUBBLE_INSET = 4;

/**
 * Floating, pill-shaped bottom tab bar with glassmorphism blur.
 *
 * A single lime-green bubble slides fluidly between tabs using
 * spring physics. Each tab occupies an equal-width slot (flex: 1)
 * so positions are mathematically stable — no layout-shift bugs.
 */
export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  // We only need to measure the inner container width once
  const [containerWidth, setContainerWidth] = useState(0);

  // Count valid tabs so the math is always correct
  const validRoutes = state.routes.filter((r) => TAB_CONFIG[r.name]);
  const tabCount = validRoutes.length;

  // Each tab slot width (equal division)
  const slotWidth = containerWidth > 0 ? containerWidth / tabCount : 0;

  // Shared values for the bubble position and width
  const bubbleLeft = useSharedValue(0);
  const bubbleWidth = useSharedValue(90);

  /** Measure the inner container that holds all tabs */
  const handleContainerLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setContainerWidth(width);
  };

  /** Get the active route's config */
  const activeRoute = state.routes[state.index];
  const activeConfig = activeRoute ? TAB_CONFIG[activeRoute.name] : null;

  /** Slide the bubble whenever the active index changes */
  useEffect(() => {
    if (slotWidth > 0 && activeConfig) {
      const slotCenter = state.index * slotWidth + slotWidth / 2;
      const targetWidth = activeConfig.bubbleWidth;
      let targetLeft = slotCenter - targetWidth / 2;

      // Clamp so the bubble never overflows the container edges
      const minLeft = BUBBLE_INSET;
      const maxLeft = containerWidth - targetWidth - BUBBLE_INSET;
      targetLeft = Math.max(minLeft, Math.min(targetLeft, maxLeft));

      bubbleLeft.value = withSpring(targetLeft, SPRING_CONFIG);
      bubbleWidth.value = withSpring(targetWidth, SPRING_CONFIG);
    }
  }, [state.index, slotWidth, containerWidth, activeConfig, bubbleLeft, bubbleWidth]);

  /** Animated style — both left and width animate */
  const bubbleStyle = useAnimatedStyle(() => ({
    left: bubbleLeft.value,
    width: bubbleWidth.value,
  }));

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={80} tint="light" style={styles.blurView}>
        {/* Inner container — flex children divide it equally */}
        <View style={styles.tabBar} onLayout={handleContainerLayout}>
          {/* ── Traveling green bubble ── */}
          <Animated.View style={[styles.bubble, bubbleStyle]} />

          {/* ── Tab buttons (each flex: 1 for stable positions) ── */}
          {state.routes.map((route, index) => {
            const config = TAB_CONFIG[route.name];
            if (!config) return null;

            const isFocused = state.index === index;
            const iconName = isFocused ? config.filled : config.outline;

            const handlePress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={handlePress}
                activeOpacity={0.8}
                style={styles.tabItem}
              >
                <Ionicons name={iconName} size={22} color={COLORS.black} />
                {isFocused && (
                  <Animated.Text
                    entering={FadeIn.duration(200).delay(100)}
                    exiting={FadeOut.duration(100)}
                    style={styles.tabLabel}
                  >
                    {config.label}
                  </Animated.Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    left: 16,
    right: 16,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  blurView: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glass,
    paddingVertical: 8,
  },

  /* ── The single traveling green bubble ── */
  bubble: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
  },

  /* ── Each tab gets equal width via flex: 1 ── */
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 30,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.black,
  },
});
