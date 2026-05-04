import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query client — shared singleton.
 *
 * - staleTime: 5 min — data is considered fresh for 5 minutes
 * - retry: 2 — retry failed queries up to 2 times
 * - refetchOnWindowFocus: false — don't refetch when app comes to foreground
 *   (mobile apps handle this via React Navigation focus events instead)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
