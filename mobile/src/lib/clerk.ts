import { tokenCache } from '@clerk/expo/token-cache';

/**
 * Clerk token cache — uses expo-secure-store under the hood.
 * Persists the Clerk session JWT so users stay signed in
 * across app restarts.
 *
 * Re-exported for use in the root layout's ClerkProvider.
 */
export { tokenCache };
