// API configuration for SendGrid
export const SENDGRID_CONFIG = {
  // Set your SendGrid API key as an environment variable
  apiKey: process.env['SENDGRID_API_KEY'] || '',
  
  // Email addresses
  fromEmail: process.env['SENDGRID_FROM_EMAIL'] || 'noreply@synkadia.com',
  toEmail: process.env['SENDGRID_TO_EMAIL'] || 'info@synkadia.com',
  
  // Email template settings
  contactEmailSubject: 'New Contact Form Submission - DocSynk',
  
  // Validate configuration
  isConfigured(): boolean {
    return !!this.apiKey && !!this.fromEmail && !!this.toEmail;
  }
};
