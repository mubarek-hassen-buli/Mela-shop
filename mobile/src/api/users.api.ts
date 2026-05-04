import api from './axios';
import type { AuthUser } from '@/store/auth.store';

/**
 * Users API — calls the NestJS backend user endpoints.
 *
 * Every function takes a `token` parameter (the Clerk session JWT)
 * so we can attach it as a Bearer header per-request.
 */

/** Fetch the currently signed-in user's profile */
export async function getMe(token: string): Promise<AuthUser> {
  const { data } = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/** Update the current user's profile */
export async function updateMe(
  token: string,
  body: { fullName?: string; avatarUrl?: string },
): Promise<AuthUser> {
  const { data } = await api.patch('/users/me', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
