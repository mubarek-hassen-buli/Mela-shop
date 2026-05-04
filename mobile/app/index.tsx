import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useAuthStore } from '@/store/auth.store';
import { getMe } from '@/api/users.api';
import { COLORS } from '@/constants/colors';

/**
 * App entry point — auth-aware router.
 *
 * 1. Not signed in → onboarding
 * 2. Signed in → fetch user profile from backend → route by role
 *    - role=admin → /(admin)
 *    - role=user  → /(user)
 */
export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { setAuth, setHydrated } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/(auth)/onboarding');
      return;
    }

    // User is signed in — fetch their profile + role from the backend
    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.replace('/(auth)/onboarding');
          return;
        }

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
        // If user doesn't exist in our DB yet (webhook hasn't fired),
        // default to the user role — webhook will sync soon
        console.warn('Failed to fetch user profile:', error);
        setHydrated();
        router.replace('/(user)');
      }
    };

    fetchUser();
  }, [isLoaded, isSignedIn]);

  // Show loading spinner while Clerk checks session
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
