import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';

/**
 * useLogout — single source of truth for the sign-out flow.
 *
 * Order of operations (sequence matters):
 * 1. Clear TanStack Query cache → no stale data survives for the next user
 * 2. Clear Zustand auth store   → no user object in memory
 * 3. Call Clerk signOut()       → invalidates the session token
 * 4. Navigate to onboarding     → after Clerk confirms the session is gone
 *
 * Returns { logout, loading } so the caller can show a spinner.
 */
export function useLogout() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1 — Wipe ALL cached server state so the next user starts fresh
      queryClient.clear();

      // Step 2 — Clear the in-memory Zustand auth store
      clearAuth();

      // Step 3 — End the Clerk session (network call)
      await signOut();

      // Step 4 — Navigate away only after Clerk confirms sign-out
      router.replace('/(auth)/onboarding');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert(
        'Sign Out Failed',
        'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [signOut, clearAuth, queryClient, router]);

  /** Shows the confirmation dialog then calls logout() */
  const confirmLogout = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  }, [logout]);

  return { logout, confirmLogout, loading };
}
