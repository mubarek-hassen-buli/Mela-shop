import { Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';

/**
 * Admin group layout — a Stack navigator.
 * We use a Stack (not Tabs) so each admin section can be pushed
 * individually and we can keep the custom header style.
 * The dashboard index screen hosts the main admin navigation.
 */
export default function AdminLayout() {
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
      <Stack.Screen name="notifications" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
