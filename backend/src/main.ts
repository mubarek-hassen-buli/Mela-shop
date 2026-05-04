import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js';

/**
 * Bootstrap the NestJS application.
 *
 * - `helmet` sets secure HTTP headers
 * - CORS enabled for Expo dev server
 * - `/api` global prefix keeps routes namespaced
 * - `rawBody: true` is required for Svix webhook verification
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Needed by Svix webhook signature verification
  });

  // Security headers
  app.use(helmet());

  // CORS — allow requests from Expo dev client
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api`);
}

bootstrap();
