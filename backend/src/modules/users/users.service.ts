import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/backend';
import { UsersRepository } from './users.repository.js';
import { updateUserSchema, type UpdateUserDto } from './dto/update-user.dto.js';
import { updateRoleSchema, type UpdateRoleDto } from './dto/update-role.dto.js';
import type { User } from '../../database/schema/index.js';

/**
 * UsersService — business logic for user operations.
 * Validates input with Zod, delegates queries to UsersRepository.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly repo: UsersRepository,
    private readonly config: ConfigService,
  ) {}

  /**
   * Get the current user's profile from the DB.
   *
   * If the user doesn't exist yet (webhook may not have fired),
   * we fetch their data directly from the Clerk API and create
   * them on-demand. This makes the system resilient to missed
   * webhook deliveries.
   */
  async getMe(clerkId: string): Promise<User> {
    let user = await this.repo.findByClerkId(clerkId);

    if (!user) {
      this.logger.log(`User ${clerkId} not in DB — syncing from Clerk API`);
      user = await this.syncFromClerk(clerkId);
    }

    return user;
  }

  /** Update the current user's profile */
  async updateMe(clerkId: string, dto: UpdateUserDto): Promise<User> {
    const parsed = updateUserSchema.parse(dto);
    const user = await this.repo.findByClerkId(clerkId);
    if (!user) throw new NotFoundException('User not found');
    return this.repo.updateProfile(clerkId, parsed);
  }

  /** List all users (admin only) */
  async findAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  /** Get a single user by ID (admin only) */
  async findById(id: number): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  /** Update a user's role (admin only) */
  async updateRole(id: number, dto: UpdateRoleDto): Promise<User> {
    const parsed = updateRoleSchema.parse(dto);
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return this.repo.updateRole(id, parsed.role);
  }

  /** Deactivate a user (admin only) */
  async deactivate(id: number): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    if (!user.isActive) throw new BadRequestException('User is already inactive');
    return this.repo.deactivate(id);
  }

  /**
   * Fetch user data directly from the Clerk API and upsert into our DB.
   *
   * Used as a fallback when the webhook hasn't delivered a user.created
   * event yet (e.g. first login in development before ngrok is configured).
   */
  private async syncFromClerk(clerkId: string): Promise<User> {
    const clerk = createClerkClient({
      secretKey: this.config.getOrThrow<string>('CLERK_SECRET_KEY'),
    });

    const clerkUser = await clerk.users.getUser(clerkId);

    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    );

    if (!primaryEmail) {
      throw new NotFoundException(`No primary email found for Clerk user: ${clerkId}`);
    }

    const fullName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;

    const user = await this.repo.upsert({
      clerkId,
      email: primaryEmail.emailAddress,
      fullName,
      avatarUrl: clerkUser.imageUrl ?? null,
    });

    this.logger.log(`Auto-synced user from Clerk: ${user.email}`);
    return user;
  }
}
