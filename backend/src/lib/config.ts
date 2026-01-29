/**
 * Centralized configuration from environment variables.
 * All env access should go through this module.
 */

/**
 * Check if the current environment is production.
 * Checks NODE_ENV for common production indicators.
 */
function isProduction(): boolean {
  const nodeEnv = process.env.NODE_ENV?.toLowerCase() ?? '';
  return nodeEnv === 'production' || nodeEnv === 'prod';
}

/**
 * Application configuration.
 */
export const config = {
  /**
   * JWT secret for signing tokens.
   */
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',

  /**
   * Database URL.
   */
  databaseUrl: process.env.DATABASE_URL ?? 'file:./dev.db',

  /**
   * Whether the environment is production.
   */
  isProduction: isProduction(),

  /**
   * DEV ONLY: Enable seed data mutation.
   * - Only works if DEV_SEED_ENABLED=true AND environment is NOT production.
   * - Hard guard: always false in production regardless of env var.
   */
  devSeedEnabled: !isProduction() && process.env.DEV_SEED_ENABLED === 'true',
} as const;

export type Config = typeof config;
