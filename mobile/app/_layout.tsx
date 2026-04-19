import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import '../global.css';

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

/**
 * Root layout — wraps the entire app with providers and the
 * top-level Stack navigator. Auth, User, Product, and Search
 * route groups are registered as child routes.
 */
export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(user)" />
        {/* Full-screen modal routes — no bottom tab bar */}
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="search" />
      </Stack>
    </>
  );
}
