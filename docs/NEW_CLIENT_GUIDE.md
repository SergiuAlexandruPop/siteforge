# SiteForge — New Client Setup Guide

> **This file lives at `docs/NEW_CLIENT_GUIDE.md` in the repo.**
> Follow this guide every time you onboard a new client.
> After Phase 6, the CLI script automates steps 1-3.

---

## Overview

Setting up a new client involves 7 steps:
1. Create client folder (code)
2. Create environment file (code)
3. Configure theme and content (code)
4. Create Cloudflare R2 bucket (dashboard)
5. Create Resend config (dashboard, optional)
6. Create Vercel project (dashboard)
7. Configure domain (dashboard + domain registrar)

**Estimated time: 1-2 hours for a new client (mostly content writing)**

---

## Step 1: Create Client Folder

### Option A: Using the CLI Script (After Phase 6)
```bash
yarn new-client
# Follow the interactive prompts:
#   Client name: doctor-maria
#   Domain: doctormaria.ro
#   Enable i18n? Yes/No
#   Enable blog? Yes/No
#   Enable dark mode? Yes/No
#   Enable contact form? Yes/No
#   Enable Smartsupp? Yes/No
```

### Option B: Manual (Before Phase 6)
```bash
# Copy the template folder
cp -r clients/_template clients/{client-name}
```

Then edit `clients/{client-name}/config.ts`:
```typescript
// Update ALL fields — don't leave template defaults
const config: ClientConfig = {
  name: 'doctor-maria',              // Folder name, no spaces
  displayName: 'Dr. Maria Popescu',  // Shown in UI
  domain: 'doctormaria.ro',
  defaultLanguage: 'ro',
  features: {
    i18n: true,                      // Set each to true/false
    blog: true,
    darkMode: false,
    contactForm: true,
    smartsupp: true,
    supabase: false,
  },
  seo: {
    siteName: 'Dr. Maria Popescu — Medic Recuperare',
    siteDescription: 'Cabinet de recuperare medicală în Cluj-Napoca.',
    ogImage: '/og-image.jpg',
  },
  contact: {
    email: 'contact@doctormaria.ro',
    phone: '+40 7XX XXX XXX',
    address: 'Str. Exemplu Nr. 10, Cluj-Napoca',
  },
  navigation: [
    { label: 'Acasă', href: '/', labelEn: 'Home' },
    { label: 'Servicii', href: '/services', labelEn: 'Services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  blog: {
    postsPerPage: 10,
    showReadingTime: true,
    showAuthor: true,
    authorName: 'Dr. Maria Popescu',
    authorAvatar: '/avatar.jpg',
  },
}
```

---

## Step 2: Create Environment File

Copy the example and fill in client-specific values:
```bash
cp env/.env.example env/.env.{client-name}
```

Edit `env/.env.{client-name}`:
```bash
# Set the client identifier
ACTIVE_CLIENT=doctor-maria

# R2 — fill after Step 4
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=            # Fill after creating R2 API token
R2_SECRET_ACCESS_KEY=        # Fill after creating R2 API token
R2_BUCKET_NAME=siteforge-doctor-maria-images
R2_PUBLIC_URL=               # Fill after enabling public access

# Resend — fill after Step 5
RESEND_API_KEY=              # Fill after creating Resend account/key
RESEND_FROM_EMAIL=noreply@doctormaria.ro
RESEND_TO_EMAIL=contact@doctormaria.ro

# GitHub — same for all clients (your token)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_REPO=yourusername/siteforge
GITHUB_BRANCH=main

# Admin
ADMIN_PASSWORD=              # Generate a strong password for this client
ADMIN_SESSION_SECRET=        # Generate: run `openssl rand -hex 16` in terminal

# Smartsupp — fill after client creates account
NEXT_PUBLIC_SMARTSUPP_ID=    # Leave empty if not using

# GA4 — fill after Step 7
NEXT_PUBLIC_GA4_ID=          # Leave empty until analytics is set up

# Supabase — leave empty unless needed
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Add yarn script to `package.json`:
```json
{
  "scripts": {
    "dev:doctor-maria": "tsx scripts/dev.ts doctor-maria"
  }
}
```

---

## Step 3: Configure Theme and Content

### 3.1 Edit Theme
Edit `clients/{client-name}/theme.ts` with the client's brand colors and fonts.

**How to choose colors:**
- Ask the client for their logo or brand guidelines
- Use https://coolors.co to generate a palette from their brand color
- Primary = their main brand color
- Use the theme.ts template — just change the hex values

**How to choose fonts:**
- Go to https://fonts.google.com
- Pick a heading font and a body font
- For blogs, keep `Georgia` or another serif as the blog font (Medium style)

### 3.2 Add Static Assets
Place in `clients/{client-name}/public/`:
- `logo.svg` or `logo.png` — client's logo
- `favicon.ico` — generate from logo at https://favicon.io
- `og-image.jpg` — 1200x630px image for social sharing
- `avatar.jpg` — blog author photo (if blog enabled)

### 3.3 Write Page Content
Create markdown files in `clients/{client-name}/content/pages/`:

**index.md** (Homepage):
```markdown
---
title: "Dr. Maria Popescu"
description: "Cabinet de recuperare medicală în Cluj-Napoca"
---

Welcome content goes here...
```

**about.md, services.md, contact.md** — one file per page listed in navigation.

### 3.4 Write First Blog Post (if blog enabled)
Create in `clients/{client-name}/content/blog/`:
```markdown
---
title: "Bine ați venit pe blogul nostru"
slug: "bine-ati-venit"
date: "2025-07-01"
author: "Dr. Maria Popescu"
excerpt: "Prima postare pe blogul cabinetului."
featuredImage: ""
published: true
readingTime: 2
tags: ["general"]
---

Post content here...
```

---

## Step 4: Create Cloudflare R2 Bucket

> **Skip this step if the client has no blog or image needs.**

### 4.1 Log into Cloudflare
Go to https://dash.cloudflare.com
(Use your main Cloudflare account — all client buckets live under one account)

### 4.2 Create Bucket
1. Left sidebar → R2 Object Storage → Overview
2. Click "Create Bucket"
3. Bucket name: `siteforge-{client-name}-images` (e.g., `siteforge-doctor-maria-images`)
4. Location: Auto (or choose Europe if client is in Romania)
5. Click "Create Bucket"

### 4.3 Enable Public Access
1. Click on the new bucket → Settings tab
2. Scroll to "Public Access"
3. Click "Allow Access"
4. Copy the public URL (looks like `https://pub-xxxxx.r2.dev`)
5. Paste into `env/.env.{client-name}` as `R2_PUBLIC_URL`

### 4.4 Create API Token (if first time)
If you haven't created an R2 API token yet:
1. R2 Overview → Manage R2 API Tokens (right sidebar)
2. Create API Token
3. Permissions: Object Read & Write
4. Specify buckets: you can limit to specific buckets or allow all
5. Click "Create API Token"
6. Copy Access Key ID → `R2_ACCESS_KEY_ID` in env
7. Copy Secret Access Key → `R2_SECRET_ACCESS_KEY` in env
8. Copy Account ID from the Cloudflare dashboard URL → `R2_ACCOUNT_ID`

**IMPORTANT:** The Access Key and Secret are shown ONCE. Save them securely.

**NOTE:** One API token can work for all buckets. You don't need a new token per client — just a new bucket.

---

## Step 5: Configure Email (Resend)

> **Skip this step if the client has no contact form.**

### Option A: Shared Resend Account (simplest)
Use your main Resend account. Emails send from `onboarding@resend.dev` (Resend's default sender). Quick, free, works immediately. Client won't see the sender address in most cases (it's the "from" in the email they receive).

1. Go to https://resend.com/api-keys
2. Create a new API key (name it after the client)
3. Copy key → `RESEND_API_KEY` in env
4. Set `RESEND_TO_EMAIL` to the client's email address

### Option B: Client's Own Domain (professional)
For emails to come from `noreply@doctormaria.ro`:
1. Create a new Resend account with a new email (free tier: 1 domain per account)
2. Add the client's domain in Resend → Domains
3. Add DNS records (Resend shows you exactly what to add) to the domain registrar
4. Wait for verification
5. Create API key → put in env

---

## Step 6: Create Vercel Project

### 6.1 Connect Repository (first time only)
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import the `siteforge` GitHub repository
4. **STOP** — don't deploy yet, configure first

### 6.2 Configure Project
1. Project Name: `siteforge-{client-name}` (e.g., `siteforge-doctor-maria`)
2. Framework Preset: Next.js (auto-detected)
3. Root Directory: `.` (leave as repo root)
4. Build Command: `yarn build:{client-name}` (e.g., `yarn build:doctor-maria`)
5. Output Directory: leave blank (Next.js default)

### 6.3 Add Environment Variables
Go to Settings → Environment Variables. Add EVERY variable from `env/.env.{client-name}`:

| Variable | Value | Environment |
|----------|-------|-------------|
| ACTIVE_CLIENT | doctor-maria | Production, Preview |
| R2_ACCOUNT_ID | (from step 4) | Production, Preview |
| R2_ACCESS_KEY_ID | (from step 4) | Production, Preview |
| R2_SECRET_ACCESS_KEY | (from step 4) | Production, Preview |
| R2_BUCKET_NAME | siteforge-doctor-maria-images | Production, Preview |
| R2_PUBLIC_URL | (from step 4) | Production, Preview |
| RESEND_API_KEY | (from step 5) | Production |
| RESEND_FROM_EMAIL | noreply@doctormaria.ro | Production |
| RESEND_TO_EMAIL | contact@doctormaria.ro | Production |
| GITHUB_TOKEN | (your token) | Production |
| GITHUB_REPO | yourusername/siteforge | Production |
| GITHUB_BRANCH | main | Production |
| ADMIN_PASSWORD | (strong password) | Production |
| ADMIN_SESSION_SECRET | (random string) | Production |
| NEXT_PUBLIC_SMARTSUPP_ID | (if applicable) | Production, Preview |
| NEXT_PUBLIC_GA4_ID | (after analytics setup) | Production |

### 6.4 Deploy
Click "Deploy". Wait for the build to complete (~60-90 seconds).
Verify the site loads at the Vercel preview URL.

---

## Step 7: Configure Domain

### 7.1 Add Domain in Vercel
1. Vercel → Project → Settings → Domains
2. Enter the client's domain: `doctormaria.ro`
3. Also add `www.doctormaria.ro` (redirects to root)

### 7.2 Update DNS at Domain Registrar
Vercel will show you DNS records to add. Typically:
- **A record:** `@` → `76.76.21.21` (Vercel's IP)
- **CNAME record:** `www` → `cname.vercel-dns.com`

Where to add these depends on where the domain was purchased:
- Namecheap: Dashboard → Domain → Advanced DNS
- GoDaddy: Domain → DNS Management
- Other: look for "DNS settings" or "DNS records"

### 7.3 Wait for DNS Propagation
Takes 5 minutes to 48 hours (usually 5-30 minutes). Check with https://dnschecker.org

### 7.4 Verify HTTPS
Vercel auto-provisions SSL certificates. After DNS propagates:
1. Visit `https://doctormaria.ro`
2. Verify the padlock icon appears
3. Verify `http://doctormaria.ro` redirects to `https://`

---

## Step 8: Set Up Analytics

### 8.1 Google Analytics 4
1. Go to https://analytics.google.com
2. Admin → Create Property
3. Property name: client's site name
4. Select country and currency
5. Create a Web data stream → enter the client's domain
6. Copy the Measurement ID (starts with `G-`)
7. Add to Vercel env vars as `NEXT_PUBLIC_GA4_ID`
8. Redeploy (or wait for next push to main)

### 8.2 Google Search Console
1. Go to https://search.google.com/search-console
2. Add Property → URL prefix → enter `https://doctormaria.ro`
3. Verify ownership (easiest: HTML tag method — add the meta tag to the SEO component, or use Vercel's auto-verification if domain is configured)
4. Submit the sitemap: `https://doctormaria.ro/sitemap.xml`

---

## Step 9: Set Up Smartsupp (Optional)

1. Go to https://www.smartsupp.com
2. Create account (free tier: 1 agent)
3. Dashboard → Settings → Chat box → Get the chat code
4. Find the Smartsupp ID in the script (looks like a long alphanumeric string)
5. Add to Vercel env vars as `NEXT_PUBLIC_SMARTSUPP_ID`

**NOTE:** The client needs their own Smartsupp account if they want to receive and respond to chats. Walk them through signup or do it for them.

---

## Post-Setup Checklist

Run through this after every new client setup:

- [ ] Site loads at `https://{domain}`
- [ ] All pages render correctly (check every nav link)
- [ ] Mobile layout works (test on phone or Chrome DevTools 375px)
- [ ] Contact form sends email to correct address
- [ ] Admin login works at `https://{domain}/admin`
- [ ] Can create, edit, and delete blog posts via CMS
- [ ] Image upload works in blog editor
- [ ] Images display correctly in published posts
- [ ] Language toggle works (if i18n enabled)
- [ ] Dark mode toggle works (if enabled)
- [ ] Smartsupp widget appears (if enabled)
- [ ] Google Analytics receiving data (check Real-time in GA4)
- [ ] Sitemap accessible at `https://{domain}/sitemap.xml`
- [ ] robots.txt accessible at `https://{domain}/robots.txt`
- [ ] Lighthouse scores: Performance > 95, SEO > 95, Accessibility > 90
- [ ] No console errors in browser DevTools

---

## Client Handoff

What to give the client after setup:

1. **Admin URL:** `https://{domain}/admin`
2. **Admin password:** (share securely, not via email — use Signal, WhatsApp, or in person)
3. **Brief training:** 5-minute video call showing them how to create/edit/delete blog posts
4. **Support channel:** how they reach you for content changes or issues
5. **Smartsupp login:** (if applicable) so they can respond to chats

---

## Troubleshooting Common Setup Issues

### "Build failed on Vercel"
- Check Vercel build logs (Project → Deployments → click failed deployment)
- Most common: missing environment variable. Compare Vercel env vars to `.env.example`
- Second most common: syntax error in `config.ts`. Test locally first with `yarn dev:{client-name}`

### "Domain not working"
- Check DNS propagation at https://dnschecker.org
- Verify A record points to `76.76.21.21`
- Wait 30 minutes and try again
- If still failing, check Vercel → Project → Domains for error messages

### "Admin login doesn't work"
- Verify `ADMIN_PASSWORD` is set in Vercel env vars
- Verify `ADMIN_SESSION_SECRET` is set (needed for cookie signing)
- Check browser console for errors
- Try in an incognito window (in case stale cookies)

### "Images not uploading"
- Verify all R2 env vars are set in Vercel
- Verify R2 bucket exists and has public access enabled
- Check Vercel function logs for upload errors
- Verify R2 API token has write permissions
