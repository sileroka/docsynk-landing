# Cloudflare Configuration for DocSynk Landing Page

## Overview
You'll configure Cloudflare to point `docsynk.cloud` to your DigitalOcean App Platform deployment while keeping `app.docsynk.cloud` pointing to your existing application.

## Step 1: Get DNS Records from DigitalOcean

### After Creating Your DigitalOcean App:
1. Go to https://cloud.digitalocean.com/apps
2. Click on your `docsynk-landing` app
3. Go to **Settings** → **Domains**
4. Click **"Add Domain"**
5. Enter `docsynk.cloud` (or `www.docsynk.cloud` if you want www)
6. DigitalOcean will show you DNS records like:

**Option A - Using CNAME (Recommended):**
```
Type: CNAME
Name: @
Target: docsynk-landing-xxxxx.ondigitalocean.app
```

**Option B - Using A Record:**
```
Type: A
Name: @
IPv4: xxx.xxx.xxx.xxx
```

**For www subdomain:**
```
Type: CNAME
Name: www
Target: docsynk-landing-xxxxx.ondigitalocean.app
```

## Step 2: Configure Cloudflare DNS

### Login to Cloudflare:
1. Go to https://dash.cloudflare.com
2. Select your `docsynk.cloud` domain
3. Click **DNS** in the left sidebar

### Current DNS Setup (What You Likely Have):
```
Type    Name    Content                              Proxy Status
A       @       <your-old-ip>                       Proxied (orange)
CNAME   app     <your-digitalocean-app>             Proxied (orange)
```

### New DNS Configuration:

#### Step 2A: Update Root Domain (@)
1. Find the existing `A` or `CNAME` record for `@` (root domain)
2. Click **Edit**
3. Update to DigitalOcean's provided target:
   - **Type**: `CNAME` (recommended)
   - **Name**: `@`
   - **Target**: `docsynk-landing-xxxxx.ondigitalocean.app` (from DigitalOcean)
   - **Proxy status**: ☁️ **Proxied** (orange cloud)
   - **TTL**: Auto
4. Click **Save**

> **Note**: Some DNS providers don't allow CNAME on root. If Cloudflare shows an error, use:
> - **Type**: `A`
> - **Name**: `@`
> - **IPv4 address**: `xxx.xxx.xxx.xxx` (from DigitalOcean)
> - **Proxy status**: ☁️ **Proxied**

#### Step 2B: Add WWW Subdomain (Optional but Recommended)
1. Click **Add record**
2. Configure:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `docsynk-landing-xxxxx.ondigitalocean.app`
   - **Proxy status**: ☁️ **Proxied** (orange cloud)
   - **TTL**: Auto
3. Click **Save**

#### Step 2C: Keep App Subdomain (No Changes Needed)
Leave your existing `app` record as-is:
```
Type: CNAME
Name: app
Target: <your-existing-digitalocean-app>
Proxy status: Proxied
```

### Final DNS Table Should Look Like:
```
Type    Name    Content                                  Proxy Status    TTL
CNAME   @       docsynk-landing-xxxxx.ondigitalocean.app Proxied         Auto
CNAME   www     docsynk-landing-xxxxx.ondigitalocean.app Proxied         Auto
CNAME   app     <your-existing-app>.ondigitalocean.app   Proxied         Auto
```

## Step 3: Configure SSL/TLS Settings

### Set SSL/TLS Mode:
1. In Cloudflare, click **SSL/TLS** in the left sidebar
2. Go to **Overview** tab
3. Set encryption mode to: **Full (strict)**
   - This ensures end-to-end encryption
   - DigitalOcean App Platform provides SSL certificates

### Enable Always Use HTTPS:
1. In **SSL/TLS** section, go to **Edge Certificates** tab
2. Scroll to **Always Use HTTPS**
3. Toggle it **ON**
4. This redirects all HTTP traffic to HTTPS

### Enable Automatic HTTPS Rewrites:
1. Still in **Edge Certificates** tab
2. Find **Automatic HTTPS Rewrites**
3. Toggle it **ON**

## Step 4: Set Up Page Rules for WWW Redirect (Optional)

If you want `www.docsynk.cloud` to redirect to `docsynk.cloud`:

1. Click **Rules** → **Page Rules** in Cloudflare
2. Click **Create Page Rule**
3. Configure:
   - **URL**: `www.docsynk.cloud/*`
   - **Setting**: **Forwarding URL** → **301 Permanent Redirect**
   - **Destination URL**: `https://docsynk.cloud/$1`
4. Click **Save and Deploy**

Or vice versa (redirect root to www):
   - **URL**: `docsynk.cloud/*`
   - **Setting**: **Forwarding URL** → **301 Permanent Redirect**
   - **Destination URL**: `https://www.docsynk.cloud/$1`

## Step 5: Performance Optimization (Recommended)

### Enable Caching:
1. Go to **Caching** → **Configuration**
2. Set **Caching Level** to **Standard**
3. Set **Browser Cache TTL** to **4 hours** or **1 day**

### Enable Auto Minify:
1. Go to **Speed** → **Optimization**
2. Enable **Auto Minify** for:
   - ✅ JavaScript
   - ✅ CSS
   - ✅ HTML

### Enable Brotli Compression:
1. In **Speed** → **Optimization**
2. Find **Brotli**
3. Toggle it **ON**

## Step 6: Security Settings (Recommended)

### Enable HSTS:
1. Go to **SSL/TLS** → **Edge Certificates**
2. Scroll to **HTTP Strict Transport Security (HSTS)**
3. Click **Enable HSTS**
4. Configure:
   - ✅ Enable HSTS
   - **Max Age**: 6 months (15768000 seconds)
   - ✅ Include subdomains
   - ✅ Preload
5. Click **Next** and **I understand**

### Security Level:
1. Go to **Security** → **Settings**
2. Set **Security Level** to **Medium** (recommended for public sites)

## Step 7: Verify Configuration

### DNS Propagation Check:
Wait 5-15 minutes, then verify:
```bash
# Check DNS resolution
dig docsynk.cloud
dig www.docsynk.cloud
dig app.docsynk.cloud

# Or use online tools:
# https://dnschecker.org
```

### Test URLs:
1. `http://docsynk.cloud` → Should redirect to HTTPS and show landing page
2. `https://docsynk.cloud` → Should show landing page
3. `https://www.docsynk.cloud` → Should show landing page (or redirect)
4. `https://app.docsynk.cloud` → Should show your existing app (unchanged)

## Troubleshooting

### Issue: "Too Many Redirects" Error
**Solution**:
1. Go to Cloudflare **SSL/TLS** → **Overview**
2. Change encryption mode to **Full (strict)**
3. Wait 5 minutes and try again

### Issue: "DNS_PROBE_FINISHED_NXDOMAIN"
**Solution**:
1. DNS hasn't propagated yet - wait 30-60 minutes
2. Clear your browser cache
3. Try incognito/private browsing mode
4. Use `dig docsynk.cloud` to verify DNS is resolving

### Issue: SSL Certificate Error
**Solution**:
1. Check DigitalOcean app has finished provisioning SSL certificate
2. In DigitalOcean app, go to **Settings** → **Domains**
3. Verify certificate status shows "Active"
4. Wait 10-15 minutes for certificate provisioning

### Issue: Landing Page Not Showing
**Solution**:
1. Verify DigitalOcean deployment succeeded
2. Check DigitalOcean app logs for errors
3. Verify DNS points to correct DigitalOcean app URL
4. Clear Cloudflare cache: **Caching** → **Configuration** → **Purge Everything**

### Issue: App Subdomain Broken
**Solution**:
1. Verify you didn't modify the `app` CNAME record
2. If modified, restore it to original target
3. Purge Cloudflare cache

## Maintenance

### Purging Cloudflare Cache After Updates:
When you push updates to GitHub and DigitalOcean deploys:
1. Go to Cloudflare **Caching** → **Configuration**
2. Click **Purge Everything** (or purge by URL)
3. This ensures users see the latest version immediately

### Monitoring:
- **Cloudflare Analytics**: Shows traffic, bandwidth, threats blocked
- **DigitalOcean Insights**: Shows app performance, build logs
- Set up **Cloudflare Notifications** for SSL expiry, high traffic

## Expected Timeline

| Action | Time |
|--------|------|
| DNS configuration in Cloudflare | 2-5 minutes |
| DNS propagation | 5-60 minutes |
| SSL certificate provisioning | 5-15 minutes |
| Full global propagation | Up to 48 hours |

Most users will see changes within 15-30 minutes, but full global propagation can take up to 48 hours.

## Final Cloudflare Settings Summary

✅ **DNS Records**:
- `@` → DigitalOcean landing page
- `www` → DigitalOcean landing page (or redirect)
- `app` → Existing DigitalOcean app

✅ **SSL/TLS**:
- Mode: Full (strict)
- Always Use HTTPS: ON
- HSTS: Enabled

✅ **Performance**:
- Caching: Standard
- Auto Minify: ON (JS, CSS, HTML)
- Brotli: ON

✅ **Security**:
- Security Level: Medium
- Proxy Status: Proxied (orange cloud)
