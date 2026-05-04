import { z } from 'zod';

/** Schema for promoting/demoting a user's role (admin-only) */
export const updateRoleSchema = z.object({
  role: z.enum(['user', 'admin'], {
    message: 'Role must be "user" or "admin"',
  }),
});

export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
