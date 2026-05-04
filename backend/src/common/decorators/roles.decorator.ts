import { SetMetadata } from '@nestjs/common';

/** Key used by the RolesGuard to read required roles */
export const ROLES_KEY = 'roles';

/**
 * @Roles('admin') decorator — restricts a route to users with the
 * specified role(s). Used in combination with the RolesGuard.
 *
 * Usage:
 *   @Roles('admin')
 *   @Get('users')
 *   findAll() { ... }
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
