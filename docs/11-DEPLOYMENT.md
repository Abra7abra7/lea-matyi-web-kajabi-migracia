# 🚀 Deployment & Hosting

## Prehľad Infraštruktúry

```
┌─────────────────────────────────────────────────────────────────┐
│                          VERCEL                                  │
│                     (Frontend + API)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Next.js   │  │   Payload   │  │     API     │              │
│  │   Frontend  │  │    Admin    │  │   Routes    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          NEON                                    │
│                     (PostgreSQL)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Vercel Setup

### Krok 1: Pripojenie Repozitára

1. Prihlásiť sa na [vercel.com](https://vercel.com)
2. "Add New" → "Project"
3. Import Git Repository (GitHub/GitLab)
4. Vybrať repozitár

### Krok 2: Konfigurácia Projektu

```
Framework Preset: Next.js
Build Command: npm run build (default)
Output Directory: .next (default)
Install Command: npm install (default)
```

### Krok 3: Environment Variables

V Vercel Dashboard → Settings → Environment Variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Payload
PAYLOAD_SECRET=your-very-long-secret-key-min-32-characters

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_STREAM_KEY_ID=xxx
CLOUDFLARE_STREAM_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"

# Resend
RESEND_API_KEY=re_xxx
EMAIL_FROM=Beauty Academy <info@beautyacademy.sk>

# App
NEXT_PUBLIC_APP_URL=https://beautyacademy.sk
```

**⚠️ DÔLEŽITÉ:** 
- Nastaviť pre všetky environments (Production, Preview, Development)
- `NEXT_PUBLIC_` prefix pre premenné dostupné na frontende

---

## 2. Neon PostgreSQL Setup

### Krok 1: Vytvorenie Databázy

1. Registrácia na [neon.tech](https://neon.tech)
2. Create Project
3. Región: `eu-central-1` (Frankfurt) - najbližšie k SK
4. Skopírovať Connection String

### Krok 2: Connection String

```
DATABASE_URL=postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Krok 3: Pooling (Odporúčané)

Pre Vercel serverless functions použite pooled connection:

```
# Pooled (pre aplikáciu)
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Direct (pre migrations)
DATABASE_URL_DIRECT=postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## 3. Doména

### Krok 1: Pridanie Domény v Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Add Domain: `beautyacademy.sk`
3. Add Domain: `www.beautyacademy.sk`

### Krok 2: DNS Nastavenia

U vášho registrátora (napr. Websupport, Active24):

**A Record (root domain):**
```
Typ: A
Názov: @
Hodnota: 76.76.21.21
TTL: 3600
```

**CNAME (www subdomain):**
```
Typ: CNAME
Názov: www
Hodnota: cname.vercel-dns.com
TTL: 3600
```

### Krok 3: SSL Certifikát

Vercel automaticky vygeneruje SSL certifikát po overení DNS.

---

## 4. Stripe Webhook (Produkcia)

### Krok 1: Vytvorenie Webhook Endpoint

1. Stripe Dashboard → Developers → Webhooks
2. Add Endpoint:
   - URL: `https://beautyacademy.sk/api/stripe/webhook`
   - Events:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `charge.refunded`

### Krok 2: Webhook Secret

Skopírovať Signing Secret a pridať do Vercel env vars ako `STRIPE_WEBHOOK_SECRET`.

---

## 5. Cloudflare (Voliteľné - CDN)

### Ak chcete používať Cloudflare ako CDN/proxy:

1. Pridajte doménu do Cloudflare
2. Zmeňte nameservery u registrátora
3. Nastavte SSL mode: "Full (Strict)"
4. Proxy status: "Proxied" (oranžový oblak)

**⚠️ Pozor:** Vercel už má vlastné CDN, Cloudflare je voliteľné.

---

## 6. Database Migrations

### Automatické (Odporúčané)

Payload CMS automaticky spúšťa migrácie pri štarte:

```typescript
// payload.config.ts
export default buildConfig({
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    // Automatické migrácie
    push: true, // Development
    // alebo
    migrationDir: './migrations', // Production
  }),
})
```

### Manuálne

```bash
# Generovanie migrácie
npm run payload migrate:create

# Spustenie migrácií
npm run payload migrate
```

---

## 7. CI/CD Pipeline

Vercel automaticky builduje pri každom push do main branch.

### Preview Deployments

- Každý PR dostane preview URL
- Testovanie pred merge do production

### Branch Protection (Odporúčané)

V GitHub/GitLab:
1. Protect `main` branch
2. Require PR reviews
3. Require passing checks

---

## 8. Monitoring

### Vercel Analytics (Zahrnuté)

- Web Vitals
- Real User Monitoring
- Error tracking

### Zapnutie

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Zapnúť Vercel Analytics
  // Automaticky funguje na Vercel
}
```

### Externý Monitoring (Voliteľné)

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Uptime Robot** - Uptime monitoring

---

## 9. Backup Strategy

### Databáza (Neon)

Neon automaticky vytvára point-in-time backupy:
- 7-dňová história (Free tier)
- 30-dňová história (Pro)

### Media Files

Pre Payload uploads odporúčame cloud storage:

```typescript
// payload.config.ts
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3'

export default buildConfig({
  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter: s3Adapter({
            bucket: 'beauty-academy-media',
            config: {
              region: 'eu-central-1',
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_KEY!,
              },
            },
          }),
        },
      },
    }),
  ],
})
```

---

## 10. Performance Checklist

### Build Optimizations

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { hostname: '*.cloudflarestream.com' },
    ],
  },
  
  // Minifikácia
  swcMinify: true,
  
  // Standalone output (menšie bundles)
  output: 'standalone',
}
```

### Caching Headers

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}
```

---

## 11. Go-Live Checklist

### Pred Spustením

- [ ] Všetky env variables nastavené
- [ ] Stripe webhook nakonfigurovaný (produkčný)
- [ ] Doména pripojená a SSL funguje
- [ ] Test platba funguje
- [ ] Video streaming funguje
- [ ] Emaily sa doručujú
- [ ] Admin panel prístupný
- [ ] Zálohovanie nastavené

### Po Spustení

- [ ] Monitoring zapnutý
- [ ] Error alerting nastavený
- [ ] Google Analytics/Tag Manager (voliteľné)
- [ ] Cookie consent (GDPR)
- [ ] Robots.txt a sitemap

---

## 12. Rollback

### Vercel Rollback

1. Dashboard → Deployments
2. Nájsť predchádzajúci stable deployment
3. Click "..." → "Promote to Production"

### Database Rollback (Neon)

1. Neon Dashboard → Project
2. Branches → Create branch from past time
3. Point aplikáciu na nový branch

---

## 📋 Deployment Checklist

```markdown
## Pre-Deployment
- [ ] Kód v main branch
- [ ] Všetky testy prechádzajú
- [ ] Environment variables nastavené
- [ ] Database migrácie pripravené

## Deployment
- [ ] Vercel build úspešný
- [ ] Doména nakonfigurovaná
- [ ] SSL certifikát aktívny
- [ ] Stripe webhook funkčný

## Post-Deployment
- [ ] Smoke test - homepage
- [ ] Smoke test - login/register
- [ ] Smoke test - checkout flow
- [ ] Smoke test - video playback
- [ ] Admin panel prístupný
- [ ] Monitoring aktívny
```

---

*Deployment na Vercel s Neon PostgreSQL pre optimálny výkon.*

