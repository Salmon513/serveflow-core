import { Injectable, Inject, Optional } from '@nestjs/common';
import { Pool } from 'pg';
import { HealthResponse } from '@serveflow/shared';
import { DATABASE_POOL } from '../../database/database.provider';

@Injectable()
export class HealthService {
  constructor(
    @Optional() @Inject(DATABASE_POOL) private readonly pool: Pool | null,
  ) {}

  async check(): Promise<HealthResponse> {
    if (!this.pool) {
      return { status: 'ok', db: 'not configured' };
    }

    try {
      await this.pool.query('SELECT 1');
      return { status: 'ok', db: 'connected' };
    } catch {
      return { status: 'ok', db: 'disconnected' };
    }
  }
}
