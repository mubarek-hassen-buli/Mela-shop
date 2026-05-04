import { SetMetadata } from '@nestjs/common';

/** Key used by the ClerkAuthGuard to identify public routes */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() decorator — marks a route as publicly accessible.
 * The ClerkAuthGuard skips JWT verification for these routes.
 *
 * Usage:
 *   @Public()
 *   @Post('webhooks/clerk')
 *   handleWebhook() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
