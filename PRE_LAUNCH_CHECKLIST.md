# GRIT Platform: Pre-Launch Readiness Checklist

Strict adherence to this protocol is required prior to production deployment.

## 1. Platform Infrastructure
- [ ] **Blaze Plan Active:** Firebase project upgraded to pay-as-you-go (required for Cloud Functions).
- [ ] **Environment Keys:** Real production credentials populated in dashboard (Firebase/Vercel).
- [ ] **Auth Providers:** Email/Password, Google, and Phone OTP enabled in Firebase console.
- [ ] **Persistence:** Firestore database initialized in production mode with active security rules.
- [ ] **Storage:** Firebase Storage bucket created with active security rules for avatars and product images.

## 2. Technical Operations
- [ ] **Deployment:** Website deployed to Production channel (live).
- [ ] **Functions:** Server-side logic deployed to `nodejs20` runtime.
- [ ] **Telemetry:** Performance Monitoring reporting active page load events.
- [ ] **Stability:** `/api/health` returning `operational` status from production domain.
- [ ] **Indexing:** `firestore.indexes.json` deployed and status reported as `Active`.

## 3. Mission-Critical Testing (E-commerce)
- [ ] **Auth Journey:** Register → Login → Logout sequence verified on real hardware.
- [ ] **Shopping Loop:** Add to Cart → Modify Quantity → Persistence across refresh verified.
- [ ] **Deployment Path:** Checkout (Step 1-3) → "Confirm Order" creates Firestore document.
- [ ] **Stock Telemetry:** Inventory decrements correctly upon order confirmation.
- [ ] **Profile System:** Avatar upload and preference persistence functional.

## 4. Digital Presence (SEO & Performance)
- [ ] **Metadata Base:** All canonical links and social share cards resolving to `www.gritapparel.com`.
- [ ] **Indexing Readiness:** `sitemap.xml` and `robots.txt` accessible and validated.
- [ ] **Rich Results:** JSON-LD structured data validated via Google Rich Results Test.
- [ ] **Core Web Vitals:** Performance score > 90, LCP < 2.5s, CLS < 0.1.

## 5. Security & Legal
- [ ] **Security Headers:** scan domain on [securityheaders.com](https://securityheaders.com) - Target: **A**.
- [ ] **Exposure Audit:** No Admin SDK keys or sensitive environment variables found in client-side bundles.
- [ ] **Legal Assets:** Privacy Policy and Terms of Service content finalized and live.

---
**Status:** [Pending Readiness Review]
**Assessor:** [Antigravity AI]
