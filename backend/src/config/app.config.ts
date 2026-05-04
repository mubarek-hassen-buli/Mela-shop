import { registerAs } from '@nestjs/config';

/**
 * Application configuration — validates and exposes env vars.
 * Access via ConfigService: config.get('app.port'), etc.
 */
export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,
  databaseUrl: process.env.DATABASE_URL,
}));
