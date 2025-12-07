# 🎓 Beauty Academy E-Learning Platform

## Prehľad Projektu

**Názov:** Beauty Academy - Vlastná E-learning Platforma  
**Klient:** Lea & Maty  
**Typ:** Single-Tenant SaaS platforma pre predaj digitálnych kurzov  
**Migrácia z:** Kajabi

---

## 📋 Obsah Dokumentácie

| Dokument | Popis |
|----------|-------|
| [01-TECH-STACK.md](./01-TECH-STACK.md) | Technológie a verzie |
| [02-PROJECT-STRUCTURE.md](./02-PROJECT-STRUCTURE.md) | Štruktúra projektu a súborov |
| [03-DATABASE-SCHEMA.md](./03-DATABASE-SCHEMA.md) | Dátové modely (Payload CMS) |
| [04-API-ROUTES.md](./04-API-ROUTES.md) | API endpointy |
| [05-STRIPE-INTEGRATION.md](./05-STRIPE-INTEGRATION.md) | Platobná integrácia |
| [06-CLOUDFLARE-STREAM.md](./06-CLOUDFLARE-STREAM.md) | Video streaming a ochrana |
| [07-EMAIL-SYSTEM.md](./07-EMAIL-SYSTEM.md) | Emailový systém (Resend) |
| [08-AUTHENTICATION.md](./08-AUTHENTICATION.md) | Autentifikácia a autorizácia |
| [09-FRONTEND-PAGES.md](./09-FRONTEND-PAGES.md) | Frontend stránky a komponenty |
| [10-MOBILE-APP.md](./10-MOBILE-APP.md) | Mobilná aplikácia (Capacitor) |
| [11-DEPLOYMENT.md](./11-DEPLOYMENT.md) | Deployment a hosting |
| [12-MIGRATION-SCRIPT.md](./12-MIGRATION-SCRIPT.md) | Migrácia dát z Kajabi |
| [13-ENVIRONMENT-VARS.md](./13-ENVIRONMENT-VARS.md) | Environment premenné |
| [14-IMPLEMENTATION-CHECKLIST.md](./14-IMPLEMENTATION-CHECKLIST.md) | Checklist implementácie |
| [15-THEMING-SYSTEM.md](./15-THEMING-SYSTEM.md) | Konfigurovateľný dizajn systém |
| [16-SEO-AI-OPTIMIZATION.md](./16-SEO-AI-OPTIMIZATION.md) | SEO & AI Search (Schema.org) |
| [17-PERFORMANCE.md](./17-PERFORMANCE.md) | Performance & Core Web Vitals |

---

## 🎯 Hlavné Funkcie

### Pre Zákazníkov
- ✅ Registrácia a prihlásenie
- ✅ Prezeranie katalógu kurzov
- ✅ Nákup kurzov (Stripe)
- ✅ Prístup k zakúpeným kurzom
- ✅ Video lekcie s ochranou obsahu
- ✅ Sťahovanie materiálov (PDF)
- ✅ Mobilná aplikácia (iOS/Android)

### Pre Administrátora
- ✅ Správa kurzov (CRUD)
- ✅ Správa modulov a lekcií
- ✅ Upload videí do Cloudflare
- ✅ Prehľad objednávok
- ✅ Správa používateľov
- ✅ Dashboard s metrikami

---

## 🚀 Quick Start

```bash
# 1. Klonovanie repozitára
git clone <repo-url>
cd beauty-academy

# 2. Inštalácia závislostí
npm install

# 3. Nastavenie environment premenných
cp .env.example .env.local
# Vyplňte hodnoty v .env.local

# 4. Spustenie databázy (dev)
npm run db:push

# 5. Spustenie dev servera
npm run dev

# Admin panel: http://localhost:3000/admin
# Frontend: http://localhost:3000
```

---

## 📅 Časový Harmonogram

| Fáza | Úlohy | Odhadovaný čas |
|------|-------|----------------|
| **1. Setup** | Inicializácia projektu, DB, Payload CMS | 1 deň |
| **2. Backend** | Kolekcie, API routes, webhooks | 2-3 dni |
| **3. Frontend** | Stránky, komponenty, UI | 3-4 dni |
| **4. Integrácie** | Stripe, Cloudflare, Resend | 2 dni |
| **5. Mobile** | Capacitor setup, testovanie | 1-2 dni |
| **6. Migrácia** | Import dát z Kajabi | 1 deň |
| **7. Testing** | E2E testy, opravy | 2 dni |
| **8. Deploy** | Vercel, DNS, produkcia | 1 deň |

**Celkový odhad: 13-16 pracovných dní**

---

## 👥 Kontakty

- **Projekt Manager:** [TBD]
- **Developer:** [TBD]
- **Klient:** Lea & Maty

---

*Posledná aktualizácia: December 2024*

