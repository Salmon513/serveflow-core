import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

export const DATABASE_POOL = 'DATABASE_POOL';

export const databaseProviders = [
  {
    provide: DATABASE_POOL,
    inject: [ConfigService],
    useFactory: (config: ConfigService): Pool => {
      return new Pool({
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        database: config.get<string>('DB_NAME', 'serveflow'),
        user: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', ''),
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 2_000,
      });
    },
  },
];
