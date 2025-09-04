export const developmentConfig = {
  NODE_ENV: 'development',
  PORT: 3000,
  VERSION: '1.0.0',

  // Database (if you add one later)
  // DATABASE_URL: 'postgresql://username:password@localhost:5432/nestjstemplate_dev',

  // JWT Configuration
  // JWT_SECRET: 'your-super-secret-jwt-key-here',
  // JWT_EXPIRES_IN: '1h',
  // JWT_REFRESH_SECRET: 'your-super-secret-refresh-key-here',
  // JWT_REFRESH_EXPIRES_IN: '7d',

  // Logging
  LOG_LEVEL: 'debug',

  // CORS
  CORS_ORIGIN: 'http://localhost:3000,http://localhost:3001',

  // Rate Limiting
  RATE_LIMIT_TTL: 60,
  RATE_LIMIT_LIMIT: 100,

  // Hot Reload specific
  WATCH_MODE: true,
  FAST_RELOAD: true,
};
