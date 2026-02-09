# 🚀 Deployment Guide — datememaybe.net

Deploy the app on **Vercel** (hosting) + **Cloudflare** (domain & security).  
Cloudflare Pages doesn't support Next.js 16 yet, so we use Vercel for hosting and Cloudflare as DNS proxy — this gives you the best of both worlds.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Step 1 — Push to GitHub](#step-1--push-to-github)
4. [Step 2 — Deploy to Vercel](#step-2--deploy-to-vercel)
5. [Step 3 — Connect datememaybe.net via Cloudflare](#step-3--connect-datememaybenet-via-cloudflare)
6. [Step 4 — Switch to Production Stripe](#step-4--switch-to-production-stripe)
7. [Step 5 — Security Hardening on Cloudflare](#step-5--security-hardening-on-cloudflare)
8. [Post-Deployment Checklist](#post-deployment-checklist)
9. [Troubleshooting](#troubleshooting)

---

## 1. Architecture Overview

```
User → Cloudflare (DNS + CDN + WAF + DDoS protection)
         ↓
       Vercel (Next.js hosting, API routes, server components)
         ↓
       Stripe (payment processing)
```

- **Cloudflare** handles DNS for `datememaybe.net`, provides free DDoS protection, WAF, SSL, and CDN caching
- **Vercel** runs the Next.js app (server components, API routes, static files)
- **Stripe** handles all payment processing — card data never touches your server

---

## 2. Prerequisites

You already have:
- ✅ Cloudflare account with `datememaybe.net` domain
- ✅ Stripe account (sandbox keys working)

You still need:
- A [GitHub account](https://github.com) (free)
- A [Vercel account](https://vercel.com) (free — sign up with your GitHub account)

---

## Step 1 — Push to GitHub

### 1a. Create a new GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `datememaybe`
3. Set it to **Private** (recommended — your code contains business logic)
4. Do NOT initialize with README (you already have files)
5. Click **Create repository**

### 1b. Push your code

Open a terminal in your project folder and run:

```bash
git init
git add -A
git commit -m "Initial commit — datememaybe.net"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/datememaybe.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

> **Note:** Your `.env.local` file with the Stripe keys is already in `.gitignore`, so it won't be uploaded. This is correct — secrets should never be in Git.

---

## Step 2 — Deploy to Vercel

### 2a. Connect your repo

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find and select your `datememaybe` repository
4. Framework Preset will auto-detect **Next.js** ✅

### 2b. Add environment variables

Before clicking Deploy, expand **"Environment Variables"** and add these **3 variables**:

| Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | Your Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `APP_URL` | `https://datememaybe.net` |
| `INVITATION_SECRET` | Your generated secret (see step above in .env.example) |

> Use the test Stripe key (`sk_test_...`) for initial testing. Switch to `sk_live_...` when going live.

### 2c. Deploy

Click **"Deploy"** and wait ~60 seconds. Vercel will:
- Install dependencies
- Build the Next.js app
- Deploy it to a URL like `datememaybe.vercel.app`

### 2d. Test the Vercel URL

Open `https://datememaybe.vercel.app` (or whatever URL Vercel gave you) and verify:
- Landing page loads
- Demo works
- Form submits and redirects to Stripe Checkout

---

## Step 3 — Connect datememaybe.net via Cloudflare

Now connect your Cloudflare domain to the Vercel deployment.

### 3a. Add the domain in Vercel

1. In your Vercel project, go to **Settings → Domains**
2. Add `datememaybe.net`
3. Also add `www.datememaybe.net`
4. Vercel will show you DNS records to add. It will look something like:
   - **Type:** CNAME
   - **Name:** `@` (or `datememaybe.net`)
   - **Value:** `cname.vercel-dns.com`

### 3b. Configure DNS in Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select `datememaybe.net`
3. Go to **DNS → Records**
4. **Delete** any existing A or CNAME records for `@` and `www`
5. Add these records:

| Type | Name | Content | Proxy |
|---|---|---|---|
| **CNAME** | `@` | `cname.vercel-dns.com` | ☁️ Proxied (orange cloud) |
| **CNAME** | `www` | `cname.vercel-dns.com` | ☁️ Proxied (orange cloud) |

> **Important:** Keep the orange cloud ON (Proxied). This routes traffic through Cloudflare's CDN, WAF, and DDoS protection.

### 3c. Set SSL mode

1. In Cloudflare, go to **SSL/TLS → Overview**
2. Set encryption mode to **"Full (strict)"**

This ensures encryption between the user ↔ Cloudflare ↔ Vercel.

### 3d. Wait for DNS propagation

DNS changes can take 5 minutes to 24 hours (usually under 10 minutes with Cloudflare).

Test by visiting `https://datememaybe.net` — it should show your app!

---

## Step 4 — Switch to Production Stripe

When you're ready to accept real payments:

### 4a. Activate your Stripe account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Complete the onboarding (business info, bank account for payouts)
3. Make sure your account is **activated**

### 4b. Get your production keys

1. In Stripe Dashboard, toggle **OFF** the "Test mode" switch (top-right corner)
2. Go to **Developers → API keys**
3. Copy the **Secret key** (starts with `sk_live_`)

### 4c. Update the key in Vercel

1. Go to your Vercel project → **Settings → Environment Variables**
2. Edit `STRIPE_SECRET_KEY`
3. Replace the `sk_test_...` value with your `sk_live_...` key
4. Click **Save**
5. Go to **Deployments** → click the **⋯** menu on the latest → **Redeploy**

### 4d. Test a real payment

1. Open `https://datememaybe.net`
2. Fill the form, proceed to checkout
3. Pay with a real card (€1.99)
4. Verify the success page shows the invitation link
5. Open the invitation link to verify it works
6. Refund the test payment from Stripe Dashboard if you want

**⚠️ NEVER commit your `sk_live_` key to Git. It stays only in Vercel's environment variables.**

---

## Step 5 — Security Hardening on Cloudflare

Since traffic routes through Cloudflare's proxy, you get free security features:

### 5a. WAF (Web Application Firewall)

1. Go to **Security → WAF**
2. Enable **Managed Rules** (free tier includes basic protection)
3. This blocks SQL injection, XSS attacks, and known exploits automatically

### 5b. Rate Limiting (Protect Checkout Endpoint)

1. Go to **Security → WAF → Rate limiting rules**
2. Click **Create rule**:
   - **Rule name:** `Protect checkout API`
   - **If:** URI Path equals `/api/checkout` AND Request Method equals `POST`
   - **Rate:** 5 requests per 1 minute
   - **Per:** IP address
   - **Action:** Block
3. Save and deploy

This prevents attackers from spamming checkout sessions.

### 5c. Bot Protection

1. Go to **Security → Bots**
2. Enable **Bot Fight Mode** (free)
3. Blocks automated bots and scrapers

### 5d. Security Headers

1. Go to **Rules → Transform Rules → Modify Response Header**
2. Create a rule and add these headers:

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

### 5e. Always Use HTTPS

1. Go to **SSL/TLS → Edge Certificates**
2. Enable **"Always Use HTTPS"**
3. Enable **"Automatic HTTPS Rewrites"**

### 5f. DDoS Protection

Already active on all Cloudflare accounts (free). No setup needed.

---

## Post-Deployment Checklist

- [ ] App loads at `https://datememaybe.net`
- [ ] App loads at `https://www.datememaybe.net`
- [ ] Landing page / hero section works
- [ ] Demo invitation works (YES/NO buttons, confetti)
- [ ] Form validation works (character limits)
- [ ] Stripe checkout redirects correctly
- [ ] Success page shows invitation link + QR code
- [ ] Invitation links (`/v/...`) render correctly
- [ ] Works on mobile (test on phone)
- [ ] Cloudflare SSL set to "Full (strict)"
- [ ] Rate limiting rule on `/api/checkout`
- [ ] Bot Fight Mode enabled
- [ ] `INVITATION_SECRET` is a strong random value ✅ (already generated)
- [ ] Stripe key is production (`sk_live_`) when going live

---

## Troubleshooting

### "This page isn't working" / 522 error

- Check that the CNAME record in Cloudflare points to `cname.vercel-dns.com`
- SSL mode must be **"Full (strict)"** — not "Flexible"
- Make sure the domain is verified in Vercel (Settings → Domains)

### Invitation links return 404 after redeployment

- `INVITATION_SECRET` must be the **same** across all deployments
- If you changed it, all previously generated links are invalid (by design)

### Stripe checkout doesn't redirect back

- Check `APP_URL` in Vercel env vars is exactly `https://datememaybe.net` (no trailing slash)
- Stripe test mode and live mode have different keys — make sure you're using the right one

### Build fails on Vercel

- Check the build logs in Vercel's dashboard (Deployments → click the failed one)
- Most common: missing environment variable — add it in Settings → Environment Variables

### "Too many redirects" error

- In Cloudflare, set SSL/TLS to **"Full (strict)"** — NOT "Flexible"
- "Flexible" causes an infinite redirect loop with Vercel

### Domain shows Cloudflare parking page

- DNS hasn't propagated yet. Wait 10-15 minutes.
- Verify CNAME record is correct in Cloudflare DNS

---

## Summary of What Lives Where

| Service | What it does | Cost |
|---|---|---|
| **GitHub** | Stores your code (private repo) | Free |
| **Vercel** | Hosts & runs the Next.js app | Free (Hobby plan) |
| **Cloudflare** | Domain, DNS, CDN, WAF, DDoS protection | Free (+ domain cost) |
| **Stripe** | Payment processing | 1.4% + €0.25 per transaction (EU cards) |
