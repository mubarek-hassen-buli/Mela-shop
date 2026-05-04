import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/expo';
import { useAuthStore } from '@/store/auth.store';
import { getMe } from '@/api/users.api';

/**
 * useCurrentUser — TanStack Query hook that fetches and caches the
 * current user's profile from the backend.
 *
 * Key cache settings:
 * - staleTime: 5 min  — data is considered fresh, no background refetch
 * - gcTime: 0         — once the profile screen unmounts (e.g. on logout),
 *                       the cache entry is garbage-collected immediately.
 *                       This ensures the next user who signs in never sees
 *                       a previous user's cached data.
 */
export function useCurrentUser() {
  const { isSignedIn, getToken } = useAuth();
  const { user: storeUser, setAuth } = useAuthStore();

  const query = useQuery({
    queryKey: ['users', 'me'],
    enabled: !!isSignedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 0, // Garbage-collect immediately on unmount — no cross-session data leaks
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
    // across renders while the query is still loading)
    user: query.data ?? storeUser,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
