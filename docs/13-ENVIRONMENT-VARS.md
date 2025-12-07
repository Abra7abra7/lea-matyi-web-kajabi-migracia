# 🔑 Environment Variables

## Kompletný Zoznam

### Lokálny Development

```env
# ═══════════════════════════════════════════════════════════════
# .env.local - DEVELOPMENT
# Tento súbor NIKDY necommitovať do Gitu!
# ═══════════════════════════════════════════════════════════════

# ─────────────────────────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────────────────────────
# Neon PostgreSQL connection string
# Format: postgresql://[user]:[password]@[host]/[database]?sslmode=require
DATABASE_URL=postgresql://neondb_owner:xxx@ep-xxx-xxx-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require

# ─────────────────────────────────────────────────────────────────
# PAYLOAD CMS
# ─────────────────────────────────────────────────────────────────
# Secret pre JWT tokeny (min 32 znakov, náhodný string)
# Generovanie: openssl rand -base64 32
PAYLOAD_SECRET=your-super-secret-payload-key-minimum-32-characters

# ─────────────────────────────────────────────────────────────────
# STRIPE
# ─────────────────────────────────────────────────────────────────
# Test keys (začínajú sk_test_ a pk_test_)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Webhook secret pre lokálne testovanie
# Získate cez: stripe listen --forward-to localhost:3000/api/stripe/webhook
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ─────────────────────────────────────────────────────────────────
# CLOUDFLARE STREAM
# ─────────────────────────────────────────────────────────────────
# Account ID (Dashboard → Account Home → pravý sidebar)
CLOUDFLARE_ACCOUNT_ID=xxx

# API Token (My Profile → API Tokens → Create Token)
CLOUDFLARE_API_TOKEN=xxx

# Signing Keys (Stream → Settings → Signing Keys)
CLOUDFLARE_STREAM_KEY_ID=xxx

# Private key - celý PEM vrátane BEGIN/END na jednom riadku s \n
# Alebo použite " a vložte celý key s reálnymi novými riadkami
CLOUDFLARE_STREAM_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----"

# ─────────────────────────────────────────────────────────────────
# RESEND (Email)
# ─────────────────────────────────────────────────────────────────
RESEND_API_KEY=re_xxx

# Email odosielateľa (musí byť z verifikovanej domény)
EMAIL_FROM=Beauty Academy <info@beautyacademy.sk>

# ─────────────────────────────────────────────────────────────────
# APPLICATION
# ─────────────────────────────────────────────────────────────────
# Base URL aplikácie (bez trailing slash)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node environment
NODE_ENV=development
```

---

## Produkčné Premenné (Vercel)

```env
# ═══════════════════════════════════════════════════════════════
# PRODUCTION - Vercel Environment Variables
# ═══════════════════════════════════════════════════════════════

# ─────────────────────────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

# ─────────────────────────────────────────────────────────────────
# PAYLOAD CMS
# ─────────────────────────────────────────────────────────────────
PAYLOAD_SECRET=production-super-secret-key-minimum-32-characters

# ─────────────────────────────────────────────────────────────────
# STRIPE (Live keys!)
# ─────────────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ─────────────────────────────────────────────────────────────────
# CLOUDFLARE STREAM
# ─────────────────────────────────────────────────────────────────
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_STREAM_KEY_ID=xxx
CLOUDFLARE_STREAM_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"

# ─────────────────────────────────────────────────────────────────
# RESEND
# ─────────────────────────────────────────────────────────────────
RESEND_API_KEY=re_xxx
EMAIL_FROM=Beauty Academy <info@beautyacademy.sk>

# ─────────────────────────────────────────────────────────────────
# APPLICATION
# ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://beautyacademy.sk
NODE_ENV=production
```

---

## Tabuľka Premenných

| Premenná | Povinná | Prefix | Popis |
|----------|---------|--------|-------|
| `DATABASE_URL` | ✅ | - | PostgreSQL connection string |
| `PAYLOAD_SECRET` | ✅ | - | JWT signing secret |
| `STRIPE_SECRET_KEY` | ✅ | - | Stripe API key (backend) |
| `STRIPE_PUBLISHABLE_KEY` | ✅ | NEXT_PUBLIC_ | Stripe key (frontend) |
| `STRIPE_WEBHOOK_SECRET` | ✅ | - | Webhook signing secret |
| `CLOUDFLARE_ACCOUNT_ID` | ✅ | - | CF Account ID |
| `CLOUDFLARE_API_TOKEN` | ✅ | - | CF API Token |
| `CLOUDFLARE_STREAM_KEY_ID` | ✅ | - | Stream signing key ID |
| `CLOUDFLARE_STREAM_PRIVATE_KEY` | ✅ | - | Stream private key |
| `RESEND_API_KEY` | ✅ | - | Resend API key |
| `EMAIL_FROM` | ✅ | - | Email sender |
| `NEXT_PUBLIC_APP_URL` | ✅ | NEXT_PUBLIC_ | Application URL |
| `NODE_ENV` | ❌ | - | Auto-set by platform |

---

## Generovanie Secretov

### PAYLOAD_SECRET

```bash
# macOS / Linux
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Online: https://generate-secret.vercel.app/32
```

### STRIPE_WEBHOOK_SECRET (Lokálne)

```bash
# Inštalácia Stripe CLI
brew install stripe/stripe-cli/stripe

# Prihlásenie
stripe login

# Spustenie webhook forwardu
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Výstup: whsec_xxx (skopírovať)
```

---

## Vercel Environment Setup

### Dashboard UI

1. Vercel → Project → Settings → Environment Variables
2. Add Variable:
   - Name: `DATABASE_URL`
   - Value: `postgresql://...`
   - Environment: Production, Preview, Development

### CLI

```bash
# Inštalácia Vercel CLI
npm i -g vercel

# Prihlásenie
vercel login

# Pridanie premennej
vercel env add DATABASE_URL

# Zobrazenie premenných
vercel env ls

# Pull do lokálneho .env
vercel env pull .env.local
```

---

## .gitignore

```gitignore
# Environment variables
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# Dependencies
node_modules/

# Build
.next/
out/
build/
dist/

# Capacitor
ios/
android/

# Misc
.DS_Store
*.log
```

---

## .env.example (Template)

```env
# ═══════════════════════════════════════════════════════════════
# .env.example - Skopírujte do .env.local a vyplňte hodnoty
# ═══════════════════════════════════════════════════════════════

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Payload CMS
PAYLOAD_SECRET=your-secret-min-32-chars

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_STREAM_KEY_ID=
CLOUDFLARE_STREAM_PRIVATE_KEY=

# Resend
RESEND_API_KEY=re_xxx
EMAIL_FROM=App Name <noreply@example.com>

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Validácia Environment Variables

```typescript
// src/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Payload
  PAYLOAD_SECRET: z.string().min(32),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  
  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_API_TOKEN: z.string().min(1),
  CLOUDFLARE_STREAM_KEY_ID: z.string().min(1),
  CLOUDFLARE_STREAM_PRIVATE_KEY: z.string().includes('PRIVATE KEY'),
  
  // Resend
  RESEND_API_KEY: z.string().startsWith('re_'),
  EMAIL_FROM: z.string().email().or(z.string().includes('<')),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export function validateEnv() {
  const result = envSchema.safeParse(process.env)
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:')
    console.error(result.error.format())
    throw new Error('Invalid environment variables')
  }
  
  return result.data
}

// Volať pri štarte aplikácie
// validateEnv()
```

---

## Debugging

### Kontrola načítania

```typescript
// V API route alebo page
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing')
console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '✅ Set' : '❌ Missing')
// ... atď
```

### Vercel Logs

```bash
# Zobrazenie logov
vercel logs

# Real-time logs
vercel logs --follow
```

---

## 📋 Checklist

- [ ] `.env.local` vytvorený z `.env.example`
- [ ] Všetky povinné premenné vyplnené
- [ ] Stripe keys (test vs live) správne
- [ ] Cloudflare private key správne formátovaný
- [ ] Vercel env variables nastavené
- [ ] `.env.local` v `.gitignore`
- [ ] `.env.example` v repozitári

---

*Bezpečné spravovanie environment variables pre vývoj a produkciu.*

