# Contact Form Testing Guide

## Current Status

✅ **Contact form code is set up and ready**
✅ **Development environment configured**
❌ **SendGrid API key not configured** (This is why emails aren't sending)

## Why Emails Aren't Sending

The contact form will work in **development mode without SendGrid configured**, but it won't actually send emails. Instead, it will:

- Accept form submissions
- Show success messages
- Log the form data to the server console

To actually send emails, you need to configure SendGrid.

## Steps to Get Emails Working

### 1. Set Up SendGrid (Required for Production)

Follow these steps from `SENDGRID-SETUP.md`:

1. **Get SendGrid API Key**:

   - Go to https://app.sendgrid.com/settings/api_keys
   - Click "Create API Key"
   - Name it "DocSynk Contact Form"
   - Give it "Mail Send" permissions
   - Copy the API key (you can only see it once!)

2. **Verify Sender Email**:

   - Go to https://app.sendgrid.com/settings/sender_auth
   - Verify your sender email (e.g., noreply@docsynk.cloud)
   - Check your email for the verification link

3. **Add API Key to .env File**:
   Edit `/home/seanrh21/repos/docsynk-landing/.env`:
   ```bash
   SENDGRID_API_KEY=your_actual_api_key_here
   SENDGRID_FROM_EMAIL=noreply@docsynk.cloud
   SENDGRID_TO_EMAIL=info@docsynk.cloud
   NODE_ENV=development
   ```

### 2. Testing Locally

#### Start the Development Server:

```bash
npm start
```

The site will be available at: http://localhost:4200

#### Test the Contact Form:

1. Go to http://localhost:4200/contact
2. Fill out the form
3. Submit it

#### What to Expect:

**Without SendGrid API key:**

- ✅ Form submits successfully
- ✅ Success message appears
- ✅ Form data logged to console
- ❌ No email sent

**With SendGrid API key:**

- ✅ Form submits successfully
- ✅ Success message appears
- ✅ Email sent to SENDGRID_TO_EMAIL
- ✅ Check your inbox!

### 3. Check Server Logs

When testing, watch the terminal where you ran `npm start`. You should see:

- Form submission logs
- SendGrid API responses
- Any errors

Example output (development mode without API key):

```
Contact Form Submission (Dev Mode): {
  name: 'John Doe',
  email: 'john@example.com',
  inquiryType: 'sales',
  subject: 'Test submission',
  message: 'This is a test message'
}
```

### 4. Production Deployment

For Cloudflare Pages or production:

1. **Add Environment Variables** in your hosting dashboard:

   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`
   - `SENDGRID_TO_EMAIL`
   - `NODE_ENV=production`

2. **Deploy** your code

3. **Test** the contact form on your live site

## Troubleshooting

### Form submits but no email received:

1. **Check SENDGRID_API_KEY is set**:

   ```bash
   node -e "require('dotenv').config(); console.log('API Key:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');"
   ```

2. **Check server console** for errors

3. **Verify sender email** is verified in SendGrid

4. **Check spam folder** in your inbox

5. **Check SendGrid Activity Feed**:
   - Go to https://app.sendgrid.com/email_activity
   - Look for your email

### Error: "Email service is not configured":

- Your SENDGRID_API_KEY is empty or missing
- Add it to your `.env` file

### Error: "SendGrid API error: 403":

- Your API key doesn't have the right permissions
- Create a new API key with "Mail Send" access

### Error: "SendGrid API error: 400":

- Your sender email is not verified in SendGrid
- Complete the sender verification process

## Current Test Status

Based on your test, here's what happened:

1. ❌ No SendGrid API key configured
2. ✅ Form submitted successfully (development mode)
3. ❌ No email sent (expected without API key)
4. ℹ️ Form data should be in server console logs

## Next Steps

1. **Get your SendGrid API key** (see SENDGRID-SETUP.md)
2. **Add it to `.env` file**
3. **Restart the dev server**: `npm start`
4. **Test again** - you should receive an email!

## Quick Start Command

```bash
# 1. Add your SendGrid API key to .env file
# 2. Start the dev server
npm start

# 3. In another terminal, test the form
# Navigate to http://localhost:4200/contact and submit the form
```

## Support

- SendGrid Documentation: https://docs.sendgrid.com
- SendGrid Support: https://support.sendgrid.com
- Full setup guide: See SENDGRID-SETUP.md in this project
