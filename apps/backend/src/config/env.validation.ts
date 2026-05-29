interface EnvironmentShape {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  AI_PROVIDER: string;
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
}

function requireNonEmpty(name: string, value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parsePositiveInt(
  name: string,
  value: unknown,
  fallback: number,
): number {
  const normalized = value === undefined || value === '' ? fallback : Number(value);

  if (!Number.isInteger(normalized) || normalized <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer`);
  }

  return normalized;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentShape {
  return {
    PORT: parsePositiveInt('PORT', config['PORT'], 3000),
    DB_HOST: requireNonEmpty('DB_HOST', config['DB_HOST']),
    DB_PORT: parsePositiveInt('DB_PORT', config['DB_PORT'], 5432),
    DB_NAME: requireNonEmpty('DB_NAME', config['DB_NAME']),
    DB_USER: requireNonEmpty('DB_USER', config['DB_USER']),
    DB_PASSWORD: requireNonEmpty('DB_PASSWORD', config['DB_PASSWORD']),
    AI_PROVIDER:
      typeof config['AI_PROVIDER'] === 'string' && config['AI_PROVIDER'].trim()
        ? config['AI_PROVIDER']
        : 'gemini',
    GEMINI_API_KEY: requireNonEmpty('GEMINI_API_KEY', config['GEMINI_API_KEY']),
    GEMINI_MODEL:
      typeof config['GEMINI_MODEL'] === 'string' && config['GEMINI_MODEL'].trim()
        ? config['GEMINI_MODEL']
        : 'gemini-2.5-flash',
  };
}
