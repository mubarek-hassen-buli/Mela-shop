import { Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service.js';
import { users, type NewUser, type User } from '../../database/schema/index.js';

/**
 * UsersRepository — all Drizzle queries for the users table.
 * Keeps raw SQL logic isolated from business logic in UsersService.
 */
@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(private readonly database: DatabaseService) {}

  /** Upsert a user by clerkId — used by webhook handler */
  async upsert(data: NewUser): Promise<User> {
    const existing = await this.findByClerkId(data.clerkId);

    if (existing) {
      const [updated] = await this.database.db
        .update(users)
        .set({
          email: data.email,
          fullName: data.fullName,
          avatarUrl: data.avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, data.clerkId))
        .returning();
      return updated;
    }

    const [created] = await this.database.db
      .insert(users)
      .values(data)
      .returning();
    return created;
  }

  /** Find a user by their Clerk ID */
  async findByClerkId(clerkId: string): Promise<User | undefined> {
    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);
    return user;
  }

  /** Find a user by internal database ID */
  async findById(id: number): Promise<User | undefined> {
    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  /** List all users — for admin panel */
  async findAll(): Promise<User[]> {
    return this.database.db
      .select()
      .from(users)
      .orderBy(users.createdAt);
  }

  /** Update a user's role */
  async updateRole(id: number, role: string): Promise<User> {
    const [updated] = await this.database.db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  /** Update a user's profile (name, avatar) */
  async updateProfile(
    clerkId: string,
    data: { fullName?: string; avatarUrl?: string },
  ): Promise<User> {
    const [updated] = await this.database.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.clerkId, clerkId))
      .returning();
    return updated;
  }

  /** Soft-delete: deactivate a user */
  async deactivate(id: number): Promise<User> {
    const [updated] = await this.database.db
      .update(users)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  /** Reactivate a deactivated user */
  async reactivate(id: number): Promise<User> {
    const [updated] = await this.database.db
      .update(users)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }
}
