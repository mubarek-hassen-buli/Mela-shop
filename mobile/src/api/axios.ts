import axios from 'axios';

/**
 * Pre-configured Axios instance.
 *
 * The Authorization header is NOT set here because Clerk's getToken()
 * is async and hook-based. Instead, we attach the token at call-time
 * using a helper (see users.api.ts).
 */
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
