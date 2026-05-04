import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser() parameter decorator — extracts the authenticated
 * user object from the request (attached by ClerkAuthGuard).
 *
 * Usage:
 *   @Get('me')
 *   getMe(@CurrentUser() user: { clerkId: string; role: string }) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
