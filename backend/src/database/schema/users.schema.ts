import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

/**
 * Users table — mirrors Clerk users with a local `role` field.
 *
 * Clerk manages authentication (email, password, OAuth). This table
 * stores the subset of user data the app needs for authorisation and
 * profile display. Synced via Clerk webhooks (user.created / user.updated).
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  /** Clerk's unique user identifier (e.g. "user_2xAbC...") */
  clerkId: text('clerk_id').unique().notNull(),

  email: text('email').unique().notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),

  /** Application role — 'user' (default) or 'admin' */
  role: text('role').default('user').notNull(),

  /** Soft-delete flag — deactivated users can't access the app */
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** TypeScript type for a row returned from the users table */
export type User = typeof users.$inferSelect;

/** TypeScript type for inserting a new row into users */
export type NewUser = typeof users.$inferInsert;
