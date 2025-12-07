# 🎓 Beauty Academy - E-Learning Platform

Vlastná e-learning platforma pre predaj digitálnych kurzov (Kajabi replacement).

## 📋 Dokumentácia

Kompletná dokumentácia projektu sa nachádza v priečinku `/docs`:

| # | Dokument | Popis |
|---|----------|-------|
| 00 | [PROJECT-OVERVIEW.md](./docs/00-PROJECT-OVERVIEW.md) | Prehľad projektu |
| 01 | [TECH-STACK.md](./docs/01-TECH-STACK.md) | Technológie a verzie |
| 02 | [PROJECT-STRUCTURE.md](./docs/02-PROJECT-STRUCTURE.md) | Štruktúra súborov |
| 03 | [DATABASE-SCHEMA.md](./docs/03-DATABASE-SCHEMA.md) | Dátové modely |
| 04 | [API-ROUTES.md](./docs/04-API-ROUTES.md) | API endpointy |
| 05 | [STRIPE-INTEGRATION.md](./docs/05-STRIPE-INTEGRATION.md) | Platobná integrácia |
| 06 | [CLOUDFLARE-STREAM.md](./docs/06-CLOUDFLARE-STREAM.md) | Video streaming |
| 07 | [EMAIL-SYSTEM.md](./docs/07-EMAIL-SYSTEM.md) | Emailový systém |
| 08 | [AUTHENTICATION.md](./docs/08-AUTHENTICATION.md) | Autentifikácia |
| 09 | [FRONTEND-PAGES.md](./docs/09-FRONTEND-PAGES.md) | Frontend stránky |
| 10 | [MOBILE-APP.md](./docs/10-MOBILE-APP.md) | Mobilná aplikácia |
| 11 | [DEPLOYMENT.md](./docs/11-DEPLOYMENT.md) | Deployment |
| 12 | [MIGRATION-SCRIPT.md](./docs/12-MIGRATION-SCRIPT.md) | Migrácia z Kajabi |
| 13 | [ENVIRONMENT-VARS.md](./docs/13-ENVIRONMENT-VARS.md) | Environment premenné |
| 14 | [IMPLEMENTATION-CHECKLIST.md](./docs/14-IMPLEMENTATION-CHECKLIST.md) | Checklist implementácie |
| 15 | [THEMING-SYSTEM.md](./docs/15-THEMING-SYSTEM.md) | Konfigurovateľný dizajn systém |
| 16 | [SEO-AI-OPTIMIZATION.md](./docs/16-SEO-AI-OPTIMIZATION.md) | SEO & AI Search (Schema.org) |
| 17 | [PERFORMANCE.md](./docs/17-PERFORMANCE.md) | Performance & Core Web Vitals |

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **CMS/Backend:** Payload CMS 3.0
- **Database:** PostgreSQL (Neon)
- **UI:** Tailwind CSS + shadcn/ui
- **Payments:** Stripe
- **Video:** Cloudflare Stream
- **Email:** Resend
- **Mobile:** Capacitor
- **Hosting:** Vercel

## 🚀 Quick Start

```bash
# 1. Inštalácia závislostí
npm install

# 2. Nastavenie environment premenných
cp .env.example .env.local
# Vyplňte hodnoty v .env.local

# 3. Spustenie dev servera
npm run dev

# Admin panel: http://localhost:3000/admin
# Frontend: http://localhost:3000
```

## 📁 Štruktúra

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/         # Frontend stránky
│   ├── (payload)/admin/    # Payload Admin
│   └── api/                # API Routes
├── config/                 # 🎨 KONFIGURÁCIA (editovať pre klienta)
│   ├── site.config.ts      # Údaje o firme, texty
│   └── theme.config.ts     # Farby, fonty
├── collections/            # Payload CMS kolekcie
├── components/             # React komponenty
├── lib/                    # Utility funkcie
└── emails/                 # Email šablóny
```

## 🎨 Prispôsobenie pre Nového Klienta

Pre zmenu vizuálu a údajov editujte **LEN** tieto súbory:

| Súbor | Účel |
|-------|------|
| `src/config/site.config.ts` | Názov, kontakty, texty, firemné údaje |
| `src/config/theme.config.ts` | Farby, fonty, gradienty |
| `public/images/logo.svg` | Logo |
| `public/favicon.ico` | Favicon |

Žiadne zmeny v komponentoch nie sú potrebné!

## 📝 Príkazy

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production
npm run payload      # Payload CLI
```

## 📄 Licencia

Private - All rights reserved.

