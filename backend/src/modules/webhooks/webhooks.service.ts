import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository.js';
import type { NewUser } from '../../database/schema/index.js';

/**
 * Clerk webhook event payload shape (subset of fields we use).
 * Full spec: https://clerk.com/docs/integrations/webhooks
 */
interface ClerkUserEventData {
  id: string; // Clerk user ID (e.g. "user_2xAbC...")
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserEventData;
}

/**
 * WebhooksService — processes verified Clerk webhook events.
 * All operations are idempotent (upsert) to handle retries safely.
 */
@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly usersRepo: UsersRepository) {}

  /** Dispatch a verified Clerk event to the appropriate handler */
  async handleClerkEvent(event: ClerkWebhookEvent): Promise<void> {
    switch (event.type) {
      case 'user.created':
      case 'user.updated':
        await this.upsertUser(event.data);
        break;
      default:
        this.logger.log(`Ignoring unhandled event type: ${event.type}`);
    }
  }

  /** Create or update a user from the Clerk payload */
  private async upsertUser(data: ClerkUserEventData): Promise<void> {
    // Find the primary email
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id,
    );

    if (!primaryEmail) {
      this.logger.warn(`No primary email found for Clerk user: ${data.id}`);
      return;
    }

    const fullName = [data.first_name, data.last_name]
      .filter(Boolean)
      .join(' ') || null;

    const userData: NewUser = {
      clerkId: data.id,
      email: primaryEmail.email_address,
      fullName,
      avatarUrl: data.image_url,
    };

    const user = await this.usersRepo.upsert(userData);
    this.logger.log(`Upserted user: ${user.email} (clerkId: ${user.clerkId})`);
  }
}
