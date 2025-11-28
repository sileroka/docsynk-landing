# Development Environment Setup

## Quick Start - Development Mode

```bash
npm start
```

That's it! Visit **http://localhost:4200**

The contact form will work in **mock mode** - it will log submissions to the console but won't send actual emails.

## What Happens in Development

- ✅ Contact form works and shows success messages
- ✅ Form data is logged to browser console
- ❌ No actual emails are sent (mock mode)
- ✅ All other features work normally

This allows you to develop and test the UI without needing a backend or SendGrid configuration.

## Viewing Form Submissions

When you submit the contact form in development:

1. Open Browser DevTools (F12)
2. Go to the **Console** tab
3. Submit the form
4. Look for: `📧 Contact Form Submission (DEV MODE - MOCK):` followed by your form data

## Production Setup

For production deployment (Cloudflare Pages, Vercel, etc.):

### Backend API Required

In production, you need a backend API to handle contact form submissions. Options:

**Option 1: Cloudflare Workers/Pages Functions**

- Create a serverless function at `/functions/api/contact.ts`
- Use SendGrid API to send emails
- Set environment variables in Cloudflare dashboard

**Option 2: Separate API Server**

- Deploy the Node.js server (`src/server.ts`, `src/api/*`)
- Update `environment.prod.ts` with your API URL
- Set SendGrid environment variables on your server

### Environment Variables (Production)

Set these in your hosting dashboard:

```bash
SENDGRID_API_KEY=your_actual_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@docsynk.cloud
SENDGRID_TO_EMAIL=info@docsynk.cloud
NODE_ENV=production
```

### Enable SendGrid in Production

Update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: "https://your-api.example.com/api", // Your API endpoint
  apiTimeout: 30000,
  version: "1.0.0",
  sendgrid: {
    enabled: true, // Enables real email sending
  },
};
```

## Browser Console Debug Info

In development mode, the console will show:

- `📧 Contact Form Submission (DEV MODE - MOCK):` - Form data
- Mock API response with fake ID and timestamp
- Any validation errors

## Common Questions

### Why don't I receive emails in development?

- **By design!** Development uses mock mode so you can test the UI without SendGrid
- Form submissions are logged to the browser console instead
- This prevents accidental test emails

### How do I test real email sending?

- Deploy to a staging environment with real backend API
- Configure SendGrid with environment variables
- Set `sendgrid.enabled: true` in environment config

### What about the `.env` file?

- The `.env` file is for the backend server only
- In development with just `npm start`, it's not used
- You'll need it when deploying the backend API

## Production Build

```bash
npm run build
```

Output: `dist/docsynk-landing-temp/browser/`

Deploy the `browser/` folder to your static hosting provider (Cloudflare Pages, Vercel, Netlify, etc.)

## Scripts Reference

- `npm start` - Start dev server (mock API)
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run watch` - Build with file watching

## Troubleshooting

### Form doesn't submit

- Check browser console for errors
- Verify all required fields are filled
- Check that the form validation is passing

### "ReferenceError" errors

- These are usually undefined variables in the code
- Check the browser console for the specific line number
- Look for typos or missing imports

### Build warnings (Sass deprecation)

- These are safe to ignore for now
- They're warnings about deprecated Sass functions
- Will be fixed in a future update

## Need Help?

See also:

- `SENDGRID-SETUP.md` - SendGrid configuration guide
- `CONTACT-FORM-TESTING.md` - Contact form testing details
- `CLOUDFLARE-SETUP.md` - Deployment instructions
