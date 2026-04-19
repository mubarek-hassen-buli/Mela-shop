import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '@/constants/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

/** Icon + label config for each tab route */
const TAB_CONFIG: Record<
  string,
  { label: string; outline: IoniconsName; filled: IoniconsName }
> = {
  index: { label: 'Home', outline: 'home-outline', filled: 'home' },
  categories: {
    label: 'Categories',
    outline: 'pricetag-outline',
    filled: 'pricetag',
  },
  cart: {
    label: 'Cart',
    outline: 'bag-handle-outline',
    filled: 'bag-handle',
  },
  profile: { label: 'Profile', outline: 'person-outline', filled: 'person' },
};

/**
 * Floating, pill-shaped bottom tab bar with glassmorphism blur.
 * The active tab shows a lime-green (#C8FF00) pill with an icon + label.
 */
export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={80} tint="light" style={styles.blurView}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIG[route.name];
            if (!config) return null;

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
                activeOpacity={0.7}
                style={[styles.tabItem, isFocused && styles.activeTab]}
              >
                <Ionicons name={iconName} size={22} color={COLORS.black} />
                {isFocused && (
                  <Text style={styles.tabLabel}>{config.label}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 20,
    left: 16,
    right: 16,
    borderRadius: 40,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    // Android elevation
    elevation: 12,
  },
  blurView: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: COLORS.glass,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  activeTab: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 22,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
});
