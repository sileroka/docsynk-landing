# Deployment Guide: DocSynk Landing Page to DigitalOcean

## Prerequisites
- GitHub repository: `sileroka/docsynk-landing`
- DigitalOcean account with App Platform access
- Domain: `docsynk.cloud` configured in Cloudflare

## Step 1: Install serve Package
```bash
npm install
```

## Step 2: Push Changes to GitHub
```bash
git add .
git commit -m "Add DigitalOcean deployment configuration"
git push origin main
```

## Step 3: Deploy to DigitalOcean App Platform

### Option A: Using DigitalOcean Web Console
1. Go to https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Select **"GitHub"** as source
4. Authenticate with GitHub and select repository: `sileroka/docsynk-landing`
5. Select branch: `main`
6. Enable **"Autodeploy"** checkbox
7. Click **"Next"**
8. DigitalOcean will detect the `.do/app.yaml` configuration
9. Review the configuration:
   - Build Command: `npm run build:prod`
   - Run Command: `npx serve dist/docsynk-landing-temp/browser -s -l 8080`
   - HTTP Port: `8080`
10. Click **"Next"** through remaining steps
11. Click **"Create Resources"**

### Option B: Using doctl CLI
```bash
# Install doctl if not already installed
brew install doctl  # macOS
# or
snap install doctl  # Linux

# Authenticate
doctl auth init

# Create app from spec file
doctl apps create --spec .do/app.yaml

# Get app ID from output, then monitor deployment
doctl apps list
```

## Step 4: Configure Custom Domain in DigitalOcean
1. In the DigitalOcean App Platform console, go to your app
2. Navigate to **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter: `docsynk.cloud`
5. DigitalOcean will provide CNAME/A records

## Step 5: Configure DNS in Cloudflare
1. Go to Cloudflare DNS settings for `docsynk.cloud`
2. Add the records provided by DigitalOcean:
   - For root domain (`docsynk.cloud`):
     - Type: `A` or `ALIAS`
     - Name: `@`
     - Value: `<DigitalOcean IP or target>`
   - For www subdomain (`www.docsynk.cloud`):
     - Type: `CNAME`
     - Name: `www`
     - Value: `<DigitalOcean app URL>`
3. Set **Proxy status** to **"Proxied"** (orange cloud icon)
4. In Cloudflare **SSL/TLS** settings:
   - Set encryption mode to **"Full"** or **"Full (strict)"**

## Step 6: Redirect app.docsynk.cloud to Main App
In Cloudflare Page Rules or your existing app's configuration:
1. Keep `app.docsynk.cloud` pointing to your existing DigitalOcean app
2. The landing page at `docsynk.cloud` will be separate

## Automatic Deployments
Once configured, every push to the `main` branch will:
1. Trigger automatic build on DigitalOcean
2. Run `npm run build:prod`
3. Deploy the updated static files
4. Be available at `docsynk.cloud` within 5-10 minutes

## Environment Variables (if needed)
If you need to add environment variables:
1. In DigitalOcean App Platform, go to **"Settings"** → **"App-Level Environment Variables"**
2. Add variables like:
   - `NODE_ENV=production`
   - `API_URL=https://api.docsynk.cloud`

## Monitoring Deployments
- View deployment logs in DigitalOcean App Platform console
- Each deployment creates a new build log
- Failed deployments will send email notifications

## Rollback Procedure
If a deployment fails:
1. Go to DigitalOcean App Platform console
2. Navigate to **"Deployments"** tab
3. Click on a previous successful deployment
4. Click **"Redeploy"**

## Cost Estimate
- Basic XXS instance: ~$5/month
- Includes 512MB RAM, sufficient for static Angular app
- Bandwidth: 100GB included

## Troubleshooting
- **Build fails**: Check build logs in DigitalOcean console
- **404 errors**: Ensure `serve -s` flag is set for SPA routing
- **SSL errors**: Verify Cloudflare SSL mode is "Full"
- **Domain not resolving**: Wait 24-48 hours for DNS propagation
