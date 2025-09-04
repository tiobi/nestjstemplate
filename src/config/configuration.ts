import { developmentConfig } from './development.config';

export default () => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';

  // Base configuration
  const baseConfig = {
    NODE_ENV: nodeEnv,
    port: parseInt(process.env.PORT ?? '3000', 10),
    VERSION: process.env.VERSION ?? '1.0.0',
  };

  // Environment-specific configurations
  switch (nodeEnv) {
    case 'development':
      return {
        ...baseConfig,
        ...developmentConfig,
        // Override with environment variables if they exist
        ...(process.env.PORT && { port: parseInt(process.env.PORT, 10) }),
        ...(process.env.VERSION && { VERSION: process.env.VERSION }),
      };

    case 'production':
      return {
        ...baseConfig,
        LOG_LEVEL: 'error',
        WATCH_MODE: false,
        FAST_RELOAD: false,
      };

    case 'test':
      return {
        ...baseConfig,
        LOG_LEVEL: 'error',
        WATCH_MODE: false,
        FAST_RELOAD: false,
        port: 0, // Use random available port for tests
      };

    default:
      return baseConfig;
  }
};
