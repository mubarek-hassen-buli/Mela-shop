import { create } from 'zustand';
import type { AppRole } from '@/constants/roles';

/** Shape of the authenticated user stored locally */
export interface AuthUser {
  id: number;
  clerkId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: AppRole;
  isActive: boolean;
}

interface AuthState {
  /** The authenticated user's profile (from GET /api/users/me) */
  user: AuthUser | null;

  /** Shorthand for the user's role */
  role: AppRole | null;

  /** Whether we've completed the initial /users/me fetch */
  hydrated: boolean;

  /** Store user data after sign-in */
  setAuth: (user: AuthUser) => void;

  /** Clear auth state on sign-out */
  clearAuth: () => void;

  /** Mark the store as hydrated (initial fetch complete) */
  setHydrated: () => void;
}

/**
 * Zustand auth store — holds the current user profile and role.
 *
 * Populated after Clerk sign-in by fetching GET /api/users/me.
 * Cleared on sign-out.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  hydrated: false,

  setAuth: (user) => set({ user, role: user.role }),

  clearAuth: () => set({ user: null, role: null, hydrated: false }),

  setHydrated: () => set({ hydrated: true }),
}));
