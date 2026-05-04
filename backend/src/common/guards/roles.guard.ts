import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { eq } from 'drizzle-orm';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { DatabaseService } from '../../database/database.service.js';
import { users } from '../../database/schema/index.js';

/**
 * RolesGuard — checks if the authenticated user has the required role.
 *
 * Runs after ClerkAuthGuard (which attaches `request.user.clerkId`).
 * Looks up the user's role in the database and compares it to the
 * roles specified by @Roles('admin').
 *
 * Also attaches the full user record to `request.user` for downstream use.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly database: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() decorator → allow any authenticated user
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const { clerkId } = request.user;

    if (!clerkId) {
      throw new ForbiddenException('User identity not found');
    }

    // Look up the user's role in the database
    const [dbUser] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!dbUser) {
      throw new ForbiddenException('User not found in database');
    }

    if (!dbUser.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    // Attach full user record to request for @CurrentUser()
    request.user = dbUser;

    if (!requiredRoles.includes(dbUser.role)) {
      throw new ForbiddenException(
        `Requires role: ${requiredRoles.join(', ')}. You have: ${dbUser.role}`,
      );
    }

    return true;
  }
}
