import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../global.css';

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

/**
 * Root layout — wraps the entire app with GestureHandlerRootView (required
 * by @gorhom/bottom-sheet) and the top-level Stack navigator.
 */
export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          // Default: hierarchical push — slides in from right, back slides out right.
          animation: 'slide_from_right',
        }}
      >
        {/* App entry point */}
        <Stack.Screen name="index" />

        {/* Auth flow — sequential sign-in / sign-up journey */}
        <Stack.Screen name="(auth)" />

        {/* Main app — standard user tab group */}
        <Stack.Screen name="(user)" />

        {/* Admin dashboard — admin-only route group */}
        <Stack.Screen name="(admin)" />

        {/* Product detail — deep hierarchical navigation */}
        <Stack.Screen name="product/[id]" />

        {/* Search — fade feels contextual rather than a directional push */}
        <Stack.Screen name="search" options={{ animation: 'fade' }} />

        {/* Auxiliary / settings screens — slide up from bottom (iOS sheet feel) */}
        <Stack.Screen name="edit-profile"   options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="privacy-policy" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="help-center"    options={{ animation: 'slide_from_bottom' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
