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
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(user)" />
        {/* Full-screen modal routes — no bottom tab bar */}
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="search" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
