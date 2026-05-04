import {
  Controller,
  Post,
  Req,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';
import { Public } from '../../common/decorators/public.decorator.js';
import { WebhooksService } from './webhooks.service.js';
import type { Request } from 'express';

/**
 * WebhooksController — receives Clerk webhook events.
 *
 * POST /api/webhooks/clerk
 *
 * 1. Reads the raw body (required for Svix signature verification)
 * 2. Verifies the Svix signature using the webhook signing secret
 * 3. Dispatches the verified event to WebhooksService
 *
 * This route is @Public() — Clerk can't send a Bearer JWT.
 */
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly config: ConfigService,
  ) {}

  @Post('clerk')
  @Public()
  async handleClerkWebhook(@Req() req: RawBodyRequest<Request>) {
    const webhookSecret = this.config.getOrThrow<string>('CLERK_WEBHOOK_SECRET');

    // Svix requires the raw, unparsed body for signature verification
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Missing raw body — ensure rawBody is enabled');
    }

    // Extract Svix headers
    const svixId = req.headers['svix-id'] as string;
    const svixTimestamp = req.headers['svix-timestamp'] as string;
    const svixSignature = req.headers['svix-signature'] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException('Missing Svix headers');
    }

    // Verify the webhook signature
    const wh = new Webhook(webhookSecret);
    let event: { type: string; data: any };

    try {
      event = wh.verify(rawBody.toString(), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as { type: string; data: any };
    } catch (error) {
      this.logger.warn(`Webhook verification failed: ${(error as Error).message}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Received Clerk webhook: ${event.type}`);

    // Process the event
    await this.webhooksService.handleClerkEvent(event);

    return { received: true };
  }
}
