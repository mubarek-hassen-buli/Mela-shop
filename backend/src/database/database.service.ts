import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema/index.js';

/**
 * DatabaseService — creates and exposes the Drizzle ORM client
 * connected to Neon PostgreSQL.
 *
 * Usage: inject `DatabaseService` and access `.db` for typed queries.
 */
@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  /** Typed Drizzle client — use this for all database queries */
  public db: NeonHttpDatabase<typeof schema>;

  constructor(private readonly config: ConfigService) {
    const databaseUrl = this.config.getOrThrow<string>('DATABASE_URL');
    const sql = neon(databaseUrl);
    this.db = drizzle(sql, { schema });
  }

  async onModuleInit() {
    this.logger.log('Database connection established (Neon + Drizzle)');
  }
}
