import { Tabs, Redirect } from 'expo-router';
import type { ExternalPathString, RelativePathString } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { CustomTabBar } from '@/components/common/CustomTabBar';

/**
 * User route group — bottom-tab navigator with a custom floating
 * glassmorphism tab bar. Four tabs: Home, Categories, Cart, Profile.
 *
 * Guard: redirects to onboarding if the user is not signed in.
 */
export default function UserLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/onboarding" />;
  }
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
      <Tabs.Screen name="edit-profile" options={{ title: 'Edit Profile', href: null }} />
      <Tabs.Screen name="privacy-policy" options={{ title: 'Privacy Policy', href: null }} />
      <Tabs.Screen name="help-center" options={{ title: 'Help Center', href: null }} />
    </Tabs>
  );
}
