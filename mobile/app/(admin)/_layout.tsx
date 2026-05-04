import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useAuthStore } from '@/store/auth.store';
import { COLORS } from '@/constants/colors';

/**
 * Admin group layout — a Stack navigator.
 * We use a Stack (not Tabs) so each admin section can be pushed
 * individually and we can keep the custom header style.
 * The dashboard index screen hosts the main admin navigation.
 *
 * Guards:
 * - Not signed in → redirect to onboarding
 * - Not admin role → redirect to /(user)
 */
export default function AdminLayout() {
  const { isSignedIn } = useAuth();
  const { role } = useAuthStore();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (role !== 'admin') {
    return <Redirect href="/(user)" />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: COLORS.white },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="users/index" />
      <Stack.Screen name="users/[id]" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="products" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
