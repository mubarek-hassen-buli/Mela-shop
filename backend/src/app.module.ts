import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import appConfig from './config/app.config.js';
import { DatabaseModule } from './database/database.module.js';
import { ClerkAuthGuard } from './common/guards/clerk-auth.guard.js';
import { UsersModule } from './modules/users/users.module.js';
import { WebhooksModule } from './modules/webhooks/webhooks.module.js';

/**
 * Root application module.
 *
 * - ConfigModule loads .env and validates env vars
 * - ThrottlerModule provides rate limiting (60 requests / 60 seconds)
 * - DatabaseModule provides the global Drizzle DB service
 * - ClerkAuthGuard is registered globally — all routes require a JWT
 *   unless decorated with @Public()
 */
@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // Rate limiting — 60 requests per minute per IP
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 60 }],
    }),

    // Database
    DatabaseModule,

    // Feature modules
    UsersModule,
    WebhooksModule,
  ],
  providers: [
    // Apply ClerkAuthGuard to ALL routes globally
    { provide: APP_GUARD, useClass: ClerkAuthGuard },

    // Apply ThrottlerGuard to ALL routes globally
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
