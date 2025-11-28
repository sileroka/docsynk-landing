export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000, // 30 seconds
  version: '1.0.0',
  sendgrid: {
    // For development, you can use the same production endpoint
    // or set up a local backend server
    enabled: true
  }
};
