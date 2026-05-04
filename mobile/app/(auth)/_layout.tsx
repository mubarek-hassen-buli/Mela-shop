import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

/**
 * Auth group layout — headerless stack for onboarding, sign-in, sign-up.
 *
 * Guard: if the user is already signed in, redirect them away from
 * the auth screens to the main app.
 */
export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  // If already signed in, go to index which handles role-based routing
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
