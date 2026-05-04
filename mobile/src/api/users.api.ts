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

/** Update the current user's profile fields */
export async function updateMe(
  token: string,
  body: {
    fullName?: string;
    username?: string;
    phoneNumber?: string;
    avatarUrl?: string;
  },
): Promise<AuthUser> {
  const { data } = await api.patch('/users/me', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Upload a profile avatar to Cloudinary via the backend.
 *
 * Sends the image as multipart/form-data.
 * Returns the Cloudinary HTTPS URL to store in the user record.
 */
export async function uploadAvatar(
  token: string,
  imageUri: string,
  mimeType: string = 'image/jpeg',
): Promise<string> {
  const formData = new FormData();

  // React Native FormData accepts { uri, name, type }
  formData.append('avatar', {
    uri: imageUri,
    name: 'avatar.jpg',
    type: mimeType,
  } as unknown as Blob);

  const { data } = await api.post<{ url: string }>('/upload/avatar', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.url;
}
