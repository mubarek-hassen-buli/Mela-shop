import { Tabs } from 'expo-router';
import type { ExternalPathString, RelativePathString } from 'expo-router';
import { CustomTabBar } from '@/components/common/CustomTabBar';

/**
 * User route group — bottom-tab navigator with a custom floating
 * glassmorphism tab bar. Four tabs: Home, Categories, Cart, Profile.
 */
export default function UserLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      {/* Hidden from the tab bar — navigated to via router.push */}
      <Tabs.Screen
        name="edit-profile"
        options={{ title: 'Edit Profile', href: null }}
      />
    </Tabs>
  );
}
