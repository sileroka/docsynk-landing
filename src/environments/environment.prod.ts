export const environment = {
  production: true,
  apiUrl: 'https://app.docsynk.cloud/api', // Cloudflare Pages Function runs on same domain
  apiTimeout: 30000, // 30 seconds
  version: '1.0.0',
  sendgrid: {
    enabled: true
  }
};
