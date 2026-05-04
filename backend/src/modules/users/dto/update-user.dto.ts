import { z } from 'zod';

/** Schema for updating the current user's own profile */
export const updateUserSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  avatarUrl: z.string().url('Must be a valid URL').optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
