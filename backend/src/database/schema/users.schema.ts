import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

/**
 * Users table — mirrors Clerk users with local profile fields.
 *
 * Clerk manages authentication. This table stores the subset of
 * user data the app needs for authorisation, profile display,
 * and user-editable fields (username, phone).
 *
 * Synced on first login via Clerk API and on updates via webhooks.
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  /** Clerk's unique user identifier (e.g. "user_2xAbC...") */
  clerkId: text('clerk_id').unique().notNull(),

  email: text('email').unique().notNull(),
  fullName: text('full_name'),

  /** Chosen by the user — unique handle (optional) */
  username: text('username').unique(),

  /** E.164 phone number, e.g. "+1 111 467 378" (optional) */
  phoneNumber: text('phone_number'),

  /** Cloudinary URL for the profile photo */
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
