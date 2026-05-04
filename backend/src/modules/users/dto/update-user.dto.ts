import { z } from 'zod';

/**
 * Zod schema for PATCH /api/users/me
 *
 * All fields are optional — the client only sends what changed.
 * Username must be lowercase letters, digits or underscores (3-20 chars).
 * Phone is stored as a free-form string (E.164 recommended but not enforced).
 */
export const updateUserSchema = z.object({
  fullName:    z.string().min(2, 'Name must be at least 2 characters').optional(),
  username:    z
    .string()
    .regex(/^[a-z0-9_]{3,20}$/, 'Lowercase letters, numbers and underscores only (3–20 chars)')
    .optional(),
  phoneNumber: z.string().min(5, 'Enter a valid phone number').optional(),
  avatarUrl:   z.string().url('Must be a valid URL').optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
