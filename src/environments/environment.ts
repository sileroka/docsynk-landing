export const environment = {
  production: false,
  apiUrl: '/api', // Will be mocked in development
  apiTimeout: 30000, // 30 seconds
  version: '1.0.0',
  sendgrid: {
    enabled: false // Disabled in dev - will use mock
  }
};
