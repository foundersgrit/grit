# GRIT Platform: Domain & SSL Configuration Guide

This guide outlines the technical steps required to connect your custom domain (`www.gritapparel.com`) and provision SSL for the GRIT platform.

## Option A: Firebase Hosting (RECOMMENDED)

Firebase Hosting provides zero-config SSL (Let's Encrypt) and high-performance global CDN delivery.

### 1. Initial Deployment
Ensure the platform is deployed to production:
```bash
firebase deploy --only hosting
```

### 2. Connect Custom Domain
1. Log in to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Build → Hosting**.
3. Click **Add custom domain**.
4. Enter your domain: `gritapparel.com`.
5. **Verify Ownership:** Firebase will provide a TXT record. Add this to your DNS provider (e.g., Namecheap, Cloudflare, GoDaddy).
6. **Configure DNS:** Once verified, Firebase will provide two **A Records**.
   - Type: `A` | Name: `@` | Value: `[Firebase IP 1]`
   - Type: `A` | Name: `@` | Value: `[Firebase IP 2]`
7. **Redirect WWW:** Create a CNAME or A record for `www` and set it to redirect to the apex domain in the Firebase console.

### 3. SSL Provisioning
- SSL is provisioned automatically upon successful DNS propagation.
- **Estimated Time:** 1-24 hours.
- Status can be tracked in the Hosting dashboard.

---

## Option B: Vercel

If deploying via Vercel, the platform uses its high-performance Edge Network.

### 1. Add Domain
1. In your **Vercel Dashboard**, go to **Settings → Domains**.
2. Add `gritapparel.com`.
3. Vercel will prompt you to add the `www` redirect automatically.

### 2. Configure DNS
Vercel typically uses CNAME flattening:
- Type: `A` | Name: `@` | Value: `76.76.21.21`
- Type: `CNAME` | Name: `www` | Value: `cname.vercel-dns.com`

---

## Post-Setup Verification

1. **Security Audit:** Visit [securityheaders.com](https://securityheaders.com) and scan your domain. The GRIT platform should return an **A/A+** score due to our pre-configured CSP and HSTS headers.
2. **Canonical Check:** Ensure `https://gritapparel.com` redirects to `https://www.gritapparel.com` (or vice versa, depending on your preference).
3. **Environment Audit:** Verify that `NEXT_PUBLIC_SITE_URL` in your production dashboard matches your final domain.
