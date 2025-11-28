# Cloudflare Pages Functions Setup for Contact Form

## Overview

The contact form is now using Cloudflare Pages Functions (serverless functions) to handle email submissions via SendGrid.

## Architecture

- **Frontend**: Angular app on Cloudflare Pages (static)
- **Backend**: Cloudflare Pages Function at `/functions/api/contact.ts`
- **Endpoint**: Automatically available at `https://yourdomain.com/api/contact`

## Setup Steps

### 1. Get a New SendGrid API Key

Since your previous key was compromised, create a new one:

1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Navigate to **Settings** > **API Keys**
3. Click **Create API Key**
4. Name it: `DocSynk-Contact-Form-Production`
5. Select **Full Access** (or at minimum **Mail Send** permission)
6. Copy the API key (you'll only see it once!)

### 2. Configure Environment Variables in Cloudflare

1. Go to your Cloudflare Pages project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables for **Production**:

   | Variable Name         | Value                     | Notes                        |
   | --------------------- | ------------------------- | ---------------------------- |
   | `SENDGRID_API_KEY`    | `SG.xxxxxxxxxxxxxxxxxxxx` | Your new SendGrid API key    |
   | `SENDGRID_FROM_EMAIL` | `noreply@docsynk.cloud`   | Verified sender in SendGrid  |
   | `SENDGRID_TO_EMAIL`   | `info@docsynk.cloud`      | Where to receive submissions |

4. Click **Save**

**Important**: The `SENDGRID_FROM_EMAIL` must be a verified sender in your SendGrid account:

- Go to SendGrid > **Settings** > **Sender Authentication**
- Either verify a single sender email OR authenticate your domain

### 3. Update Production API URL

The production environment is already configured correctly:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: "https://app.docsynk.cloud/api", // ← Update this to your actual domain
  sendgrid: { enabled: true },
};
```

**Update `apiUrl` to match your Cloudflare Pages domain:**

- If using custom domain: `https://docsynk.com/api` (no subdomain needed)
- If using Cloudflare subdomain: `https://docsynk-landing.pages.dev/api`

### 4. Deploy to Cloudflare Pages

The Cloudflare Pages Function will be automatically deployed when you push to your repository:

```bash
# Make sure everything is committed
git add functions/api/contact.ts
git commit -m "Add Cloudflare Pages Function for contact form"
git push origin main
```

Cloudflare will detect the `/functions/` directory and deploy the serverless function automatically.

### 5. Verify Deployment

After deployment completes:

1. Check the deployment logs in Cloudflare Pages dashboard
2. Look for confirmation that the Function was deployed
3. Test the contact form on your production site
4. Check SendGrid dashboard for sent emails

## How It Works

1. **User submits form** on `https://yourdomain.com/contact`
2. **Angular app sends POST** to `https://yourdomain.com/api/contact`
3. **Cloudflare Pages Function** (`/functions/api/contact.ts`) handles the request
4. **Function validates** the form data
5. **Function calls SendGrid API** to send email
6. **Response sent back** to user (success/error message)

## File Structure

```
docsynk-landing/
├── functions/              ← Cloudflare Pages Functions
│   └── api/
│       └── contact.ts      ← POST /api/contact handler
├── src/
│   ├── environments/
│   │   └── environment.prod.ts  ← Update apiUrl here
│   └── app/
│       └── services/
│           └── contact.service.ts
```

## Testing in Production

After deployment:

1. Go to your production site's contact page
2. Fill out the form completely
3. Submit the form
4. You should see success message
5. Check the email inbox configured in `SENDGRID_TO_EMAIL`

## Troubleshooting

### No email received

- **Check Cloudflare Functions logs**: Pages dashboard > Functions > Logs
- **Verify SendGrid API key**: Make sure it's set in Cloudflare environment variables
- **Check SendGrid activity**: SendGrid dashboard > Activity Feed
- **Verify sender email**: Must be authenticated in SendGrid

### CORS errors

The function already includes CORS headers. If you still see errors:

- Ensure `apiUrl` in `environment.prod.ts` matches your domain
- Check browser console for specific CORS error messages

### Function not found (404)

- Make sure `/functions/api/contact.ts` is in your git repository
- Check Cloudflare deployment logs to confirm Function was deployed
- Verify the path matches: POST to `/api/contact` (not `/functions/api/contact`)

## Development vs Production

| Environment                   | Behavior                                       | Configuration                                    |
| ----------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| **Development** (`npm start`) | Mock mode, logs to console, no emails sent     | `environment.ts`: `sendgrid.enabled = false`     |
| **Production** (Cloudflare)   | Real emails via Cloudflare Function + SendGrid | `environment.prod.ts`: `sendgrid.enabled = true` |

## Security Notes

- ✅ API key stored in Cloudflare environment variables (not in code)
- ✅ Never commit `.env` files with real API keys
- ✅ Functions run on Cloudflare's edge (secure, fast)
- ✅ CORS configured to accept requests
- ✅ Input validation in the Function

## Next Steps

1. Get new SendGrid API key
2. Configure Cloudflare environment variables
3. Update `environment.prod.ts` with correct domain
4. Deploy to Cloudflare Pages
5. Test the contact form in production

---

**Need help?** Check the Cloudflare Functions documentation: https://developers.cloudflare.com/pages/functions/
