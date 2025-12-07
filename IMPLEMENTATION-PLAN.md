# 🚀 Implementačný Plán - Beauty Academy

## Prehľad

Projekt bude implementovaný v **9 fázach**. Po každej fáze:
1. ✅ Otestovať funkčnosť
2. ✅ Git commit + push
3. ✅ Pokračovať na ďalšiu fázu

---

## 🎯 KĽÚČOVÉ PRIORITY

### 1. ⚡ RÝCHLOSŤ NAČÍTANIA (Core Web Vitals)
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- Server Components kde možné
- Image optimization (next/image, WebP/AVIF)
- Font optimization (next/font)
- Code splitting & lazy loading

### 2. 🤖 AI SEARCH OPTIMIZATION
Príprava pre AI vyhľadávače:
- **Google Search** - SEO, sitemap, robots.txt
- **Perplexity AI** - Structured data, clean content
- **ChatGPT Browse** - Schema.org markup
- **Tavily** - Meta descriptions, headings
- **Bing/Copilot** - OpenGraph, Twitter cards

### 3. 📊 STRUCTURED DATA (Schema.org)
Každá stránka bude mať JSON-LD schémy:
- `Organization` - údaje o firme
- `Course` - kurzy (name, description, price, provider)
- `VideoObject` - video lekcie
- `Product` - pre nákup
- `BreadcrumbList` - navigácia
- `FAQPage` - FAQ sekcia
- `Review` - hodnotenia

---

## 📋 Fázy Implementácie

### FÁZA 1: Inicializácia Projektu
**Odhad: 30-60 min**

| # | Úloha | Test |
|---|-------|------|
| 1.1 | Inicializovať Git repozitár | `git status` funguje |
| 1.2 | Vytvoriť Next.js + Payload projekt | `npm run dev` beží |
| 1.3 | Nainštalovať všetky závislosti | Žiadne npm errors |
| 1.4 | Nastaviť shadcn/ui | Komponenty dostupné |
| 1.5 | Vytvoriť config súbory | Import funguje |
| 1.6 | Nastaviť Tailwind s theme | Farby sa aplikujú |

**Git commit:** `feat: initial project setup with Next.js, Payload, shadcn/ui`

---

### FÁZA 2: Payload CMS & Databáza
**Odhad: 1-2 hodiny**

| # | Úloha | Test |
|---|-------|------|
| 2.1 | Vytvoriť Users kolekciu | Admin panel → Users funguje |
| 2.2 | Vytvoriť Courses kolekciu | Vytvorenie kurzu funguje |
| 2.3 | Vytvoriť Orders kolekciu | Kolekcia viditeľná |
| 2.4 | Vytvoriť Media kolekciu | Upload funguje |
| 2.5 | Nastaviť access control | Len admin môže editovať kurzy |
| 2.6 | Seed testovacích dát | Testovací kurz + admin user |

**Git commit:** `feat: Payload CMS collections (Users, Courses, Orders, Media)`

---

### FÁZA 3: Autentifikácia
**Odhad: 1-2 hodiny**

| # | Úloha | Test |
|---|-------|------|
| 3.1 | Login stránka + formulár | Prihlásenie funguje |
| 3.2 | Register stránka + formulár | Registrácia funguje |
| 3.3 | Logout funkcionalita | Odhlásenie funguje |
| 3.4 | Password reset flow | Email sa odošle |
| 3.5 | Protected routes (middleware) | Dashboard vyžaduje login |
| 3.6 | useAuth hook | User dostupný v komponentoch |

**Git commit:** `feat: authentication (login, register, logout, password reset)`

---

### FÁZA 4: Frontend - Základné Stránky
**Odhad: 2-3 hodiny**

| # | Úloha | Test |
|---|-------|------|
| 4.1 | Layout (Header, Footer) | Navigácia funguje |
| 4.2 | Homepage s Hero | Stránka sa renderuje |
| 4.3 | Katalóg kurzov (/kurzy) | Zoznam kurzov viditeľný |
| 4.4 | Detail kurzu (/kurzy/[slug]) | Kurz sa zobrazí |
| 4.5 | Dashboard (moje kurzy) | Zakúpené kurzy viditeľné |
| 4.6 | Responzívny dizajn | Mobile view OK |

**Git commit:** `feat: frontend pages (home, courses, course detail, dashboard)`

---

### FÁZA 5: Stripe Integrácia
**Odhad: 2-3 hodiny**

| # | Úloha | Test |
|---|-------|------|
| 5.1 | Stripe client setup | Import funguje |
| 5.2 | Checkout API route | Session sa vytvorí |
| 5.3 | Webhook handler | Webhook prijatý |
| 5.4 | CheckoutButton komponent | Redirect na Stripe |
| 5.5 | Success/Cancel handling | Správne message po platbe |
| 5.6 | Order sa vytvorí + kurz priradený | DB aktualizovaná |

**Test:** Kompletný purchase flow s test kartou `4242 4242 4242 4242`

**Git commit:** `feat: Stripe integration (checkout, webhooks, orders)`

---

### FÁZA 6: Video Streaming
**Odhad: 1-2 hodiny**

| # | Úloha | Test |
|---|-------|------|
| 6.1 | Cloudflare Stream setup | Token sa generuje |
| 6.2 | Signed URL generátor | URL platná 6h |
| 6.3 | VideoPlayer komponent | Video sa prehrá |
| 6.4 | Lekcia stránka | Video + obsah viditeľný |
| 6.5 | Access control na lekciách | Bez kurzu → redirect |
| 6.6 | Navigácia medzi lekciami | Prev/Next funguje |

**Git commit:** `feat: video streaming with Cloudflare Stream (signed URLs)`

---

### FÁZA 7: Email Systém
**Odhad: 1 hodina**

| # | Úloha | Test |
|---|-------|------|
| 7.1 | Resend client setup | Import funguje |
| 7.2 | Email šablóny (React Email) | Preview funguje |
| 7.3 | Order confirmation email | Email sa odošle po nákupe |
| 7.4 | Welcome email | Email po registrácii |
| 7.5 | Password reset email | Email s linkom |

**Git commit:** `feat: email system with Resend (templates, sending)`

---

### FÁZA 8: SEO & AI Search Optimization
**Odhad: 2-3 hodiny** ⭐ PRIORITA

| # | Úloha | Test |
|---|-------|------|
| 8.1 | Schema.org JSON-LD komponenty | Google Rich Results Test |
| 8.2 | Course schema na detail kurzu | Štruktúrované dáta validné |
| 8.3 | VideoObject schema na lekciách | Video metadata |
| 8.4 | Organization schema | Firemné údaje |
| 8.5 | BreadcrumbList na všetkých stránkach | Navigačná schéma |
| 8.6 | Sitemap.xml generátor | `/sitemap.xml` funguje |
| 8.7 | Robots.txt | `/robots.txt` správne |
| 8.8 | OpenGraph + Twitter cards | Social preview funguje |
| 8.9 | Canonical URLs | Žiadne duplicity |
| 8.10 | Meta descriptions z config | Dynamické meta |

**Test:** 
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/

**Git commit:** `feat: SEO & AI search optimization (schemas, sitemap, meta)`

---

### FÁZA 9: Performance & Finalizácia
**Odhad: 2-3 hodiny** ⭐ PRIORITA

| # | Úloha | Test |
|---|-------|------|
| 9.1 | Audit s Lighthouse | Score > 90 všetky |
| 9.2 | Image optimization (next/image) | WebP/AVIF formáty |
| 9.3 | Font optimization (next/font) | Žiadny layout shift |
| 9.4 | Code splitting & lazy loading | Bundle size < 200KB |
| 9.5 | Server Components optimalizácia | Minimálny JS na klientovi |
| 9.6 | Caching headers | Static assets cached |
| 9.7 | Error handling & loading states | UX polish |
| 9.8 | Mobile CSS (safe areas) | iPhone notch OK |
| 9.9 | Final E2E testing | Celý flow funguje |
| 9.10 | Performance monitoring setup | Vercel Analytics |

**Test:**
- Lighthouse: všetky metriky > 90
- PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://webpagetest.org/

**Git commit:** `feat: performance optimization (images, fonts, caching, Core Web Vitals)`

---

## 🧪 Testovací Scenár (Po Fáze 9)

### Funkčný Test
```
1. Otvoriť homepage
2. Prezrieť kurzy
3. Registrovať sa (nový email)
4. Prihlásiť sa
5. Otvoriť detail kurzu
6. Kliknúť "Kúpiť"
7. Zaplatiť test kartou
8. Po redirecte - kurz je v dashboarde
9. Otvoriť lekciu
10. Video sa prehrá
11. Skontrolovať email (order confirmation)
12. Odhlásiť sa
13. Reset hesla flow
```

### SEO & AI Test
```
1. Google Rich Results Test - všetky schémy validné
2. /sitemap.xml - obsahuje všetky stránky
3. /robots.txt - správne pravidlá
4. OpenGraph preview (Facebook, LinkedIn)
5. Twitter Card preview
6. Breadcrumbs na každej stránke
```

### Performance Test
```
1. Lighthouse audit > 90 všetky metriky
2. PageSpeed Insights - mobile & desktop
3. Prvé načítanie < 3s
4. Obrázky v WebP/AVIF
5. Žiadny layout shift (CLS < 0.1)
6. Mobile responzívnosť
```

---

## 📊 Progress Tracker

```
FÁZA 1: Setup          [ ] Čaká
FÁZA 2: Payload CMS    [ ] Čaká
FÁZA 3: Auth           [ ] Čaká
FÁZA 4: Frontend       [ ] Čaká
FÁZA 5: Stripe         [ ] Čaká
FÁZA 6: Video          [ ] Čaká
FÁZA 7: Email          [ ] Čaká
FÁZA 8: SEO & AI ⭐    [ ] Čaká
FÁZA 9: Performance ⭐ [ ] Čaká

━━━━━━━━━━━━━━━━━━━━━━
CELKOVO: 0/9 fáz (0%)
```

---

## ⚙️ Požiadavky Pred Štartom

### Potrebné Credentials (ak máte)

- [ ] **Neon.tech** - DATABASE_URL (vytvorím ak nemáte)
- [ ] **Stripe** - Test API keys (vytvorím ak nemáte)
- [ ] **Cloudflare Stream** - Account + Keys (môžeme simulovať)
- [ ] **Resend** - API Key (môžeme simulovať)

### Alebo

Môžem začať s **lokálnym vývojom** a používať:
- SQLite namiesto PostgreSQL (pre development)
- Stripe test mode
- Mock video player
- Console.log namiesto emailov

**Čo preferujete?**

---

## 🚦 Štart

Po vašom schválení začnem s **FÁZOU 1**.

Chcete:
1. **Začať hneď** - budem používať lokálne/mock riešenia
2. **Počkať na credentials** - dodáte API keys pred štartom
3. **Upraviť plán** - niečo zmeniť/pridať

?

