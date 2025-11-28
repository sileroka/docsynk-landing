# SendGrid Setup for Contact Form

This guide will help you configure SendGrid to handle contact form submissions for the DocSynk landing page.

## Prerequisites

- A SendGrid account (sign up at https://sendgrid.com)
- Verified sender email address in SendGrid

## Step 1: Get Your SendGrid API Key

1. Log in to your SendGrid account at https://app.sendgrid.com
2. Navigate to **Settings** > **API Keys**
3. Click **Create API Key**
4. Name your key (e.g., "DocSynk Contact Form")
5. Select **Full Access** or **Restricted Access** with:
   - Mail Send: Full Access
6. Click **Create & View**
7. **Copy the API key** (you won't be able to see it again)

## Step 2: Verify Your Sender Email

1. In SendGrid, go to **Settings** > **Sender Authentication**
2. Choose one of these options:
   - **Single Sender Verification** (Quick): Verify a single email address
   - **Domain Authentication** (Recommended): Verify your entire domain

### For Single Sender Verification:

1. Click **Verify a Single Sender**
2. Fill out the form with your details
3. Use an email like `noreply@docsynk.cloud` or your support email
4. Check your email and click the verification link

## Step 3: Configure Environment Variables

### For Local Development

Create a `.env` file in the project root (or add to your existing one):

\`\`\`bash

# SendGrid Configuration

SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@docsynk.cloud
SENDGRID_TO_EMAIL=support@docsynk.cloud
NODE_ENV=development
\`\`\`

**Important:** Add `.env` to your `.gitignore` file to keep your API key secret!

### For Production (Cloudflare Pages)

1. Go to your Cloudflare Pages project
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables:
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `SENDGRID_FROM_EMAIL`: The verified sender email (e.g., `noreply@docsynk.cloud`)
   - `SENDGRID_TO_EMAIL`: Where contact forms should be sent (e.g., `support@docsynk.cloud`)
   - `NODE_ENV`: `production`

## Step 4: Update Email Addresses

In `src/config/sendgrid.config.ts`, you can customize the default values or they will be overridden by environment variables:

\`\`\`typescript
export const SENDGRID_CONFIG = {
apiKey: process.env['SENDGRID_API_KEY'] || '',
fromEmail: process.env['SENDGRID_FROM_EMAIL'] || 'noreply@docsynk.cloud',
toEmail: process.env['SENDGRID_TO_EMAIL'] || 'support@docsynk.cloud',
contactEmailSubject: 'New Contact Form Submission - DocSynk',
};
\`\`\`

## Step 5: Test the Contact Form

### Local Testing

1. Start your development server:
   \`\`\`bash
   npm start
   \`\`\`

2. Navigate to the contact page: `http://localhost:4200/contact`

3. Fill out and submit the form

4. Check the console for logs:
   - In development mode without SendGrid configured, it will log the form data
   - With SendGrid configured, you should receive an email

### Production Testing

After deploying to production:

1. Visit your production contact page
2. Submit a test form
3. Check your configured `SENDGRID_TO_EMAIL` inbox

## Troubleshooting

### Common Issues

1. **"Email service is not configured" error**

   - Check that all three environment variables are set
   - Verify the API key is correct

2. **"SendGrid API error: 403"**

   - Your API key doesn't have the right permissions
   - Create a new API key with Mail Send access

3. **"SendGrid API error: 400"**

   - Your sender email is not verified in SendGrid
   - Complete the sender verification process

4. **Emails not arriving**
   - Check your spam/junk folder
   - Verify the `SENDGRID_TO_EMAIL` is correct
   - Check SendGrid's Activity Feed (Settings > Activity)

### Development Mode

When SendGrid is not configured in development:

- The form will still work
- Form data will be logged to the console
- A success message will be shown to the user
- No actual email will be sent

## Email Customization

To customize the email template, edit `src/api/contact.handler.ts`:

- `generateEmailTemplate()`: HTML email format
- `generateEmailText()`: Plain text email format
- `SENDGRID_CONFIG.contactEmailSubject`: Email subject line

## Security Best Practices

1. **Never commit your API key** to version control
2. Use environment variables for all sensitive data
3. Keep your SendGrid API key restricted to Mail Send only
4. Rotate your API keys periodically
5. Monitor SendGrid's Activity Feed for unusual activity

## API Rate Limits

SendGrid free tier includes:

- 100 emails per day

If you need more, upgrade your SendGrid plan or implement rate limiting in the API handler.

## Support

For SendGrid-specific issues, visit:

- SendGrid Documentation: https://docs.sendgrid.com
- SendGrid Support: https://support.sendgrid.com

For application issues, check the server logs or contact the development team.
