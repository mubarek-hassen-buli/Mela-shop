import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/expo';
import { useAuthStore } from '@/store/auth.store';
import { getMe } from '@/api/users.api';

/**
 * useCurrentUser — TanStack Query hook that fetches and caches the
 * current user's profile from the backend.
 *
 * - Only runs when the user is signed into Clerk
 * - Keeps the Zustand auth store in sync on successful fetch
 * - Returns { user, isLoading, isError, refetch }
 */
export function useCurrentUser() {
  const { isSignedIn, getToken } = useAuth();
  const { user: storeUser, setAuth } = useAuthStore();

  const query = useQuery({
    queryKey: ['users', 'me'],
    enabled: !!isSignedIn,
    staleTime: 5 * 60 * 1000, // 5 min — profile doesn't change often
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token');
      const user = await getMe(token);
      // Keep the Zustand store in sync whenever we get fresh data
      setAuth(user);
      return user;
    },
  });

  return {
    // Prefer TanStack's fresh data, fall back to Zustand store (persisted
    // across renders while query is still loading)
    user: query.data ?? storeUser,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
