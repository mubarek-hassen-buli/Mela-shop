import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getMe } from '@/api/users.api';
import { COLORS } from '@/constants/colors';

/**
 * App entry point — auth-aware router.
 *
 * 1. Not signed in → onboarding
 * 2. Signed in     → remove any stale query cache from a previous session
 *                  → fetch fresh user profile from backend
 *                  → route by role (admin → /(admin), user → /(user))
 *
 * The queryClient.removeQueries() call is the belt-and-suspenders defence:
 * even if gcTime hasn't fired yet after a logout, the new user always
 * starts with a clean slate before their profile is fetched.
 */
export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { setAuth, setHydrated } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/(auth)/onboarding');
      return;
    }

    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.replace('/(auth)/onboarding');
          return;
        }

        // Remove any cached profile from a previous session before fetching
        queryClient.removeQueries({ queryKey: ['users', 'me'] });

        const user = await getMe(token);
        setAuth(user);
        setHydrated();

        // Route based on role
        if (user.role === 'admin') {
          router.replace('/(admin)');
        } else {
          router.replace('/(user)');
        }
      } catch (error) {
        console.warn('Failed to fetch user profile:', error);
        setHydrated();
        router.replace('/(user)');
      }
    };

    fetchUser();
  }, [isLoaded, isSignedIn]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.black} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});
