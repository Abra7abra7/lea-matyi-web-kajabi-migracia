# ✅ Implementation Checklist

## Kompletný Checklist Implementácie

Tento dokument slúži ako roadmapa pre implementáciu. Odškrtávajte položky počas vývoja.

---

## Fáza 0: Konfigurácia Klienta (Pred Vývojom)

### 0.1 Site Config
- [ ] Vyplniť `src/config/site.config.ts`:
  - [ ] Názov projektu (name, shortName)
  - [ ] Popis a tagline
  - [ ] Kontaktné údaje (email, telefón, adresa)
  - [ ] Sociálne siete
  - [ ] Firemné údaje (IČO, DIČ, IČ DPH)
  - [ ] SEO údaje
  - [ ] Texty pre Hero sekciu
  - [ ] Štatistiky
  - [ ] CTA texty
  - [ ] Navigácia

### 0.2 Theme Config
- [ ] Vyplniť `src/config/theme.config.ts`:
  - [ ] Primárna farba (použiť https://uicolors.app)
  - [ ] Sekundárna farba (voliteľné)
  - [ ] Gradienty
  - [ ] Fonty (Google Fonts)

### 0.3 Assets od Klienta
- [ ] Logo (SVG, min 200x50px)
- [ ] Logo pre dark mode
- [ ] OG Image pre social sharing (1200x630px)
- [ ] Favicon (512x512px, PNG)
- [ ] App Icon pre mobil (1024x1024px)
- [ ] Hero obrázok/video (voliteľné)

---

## Fáza 1: Setup Projektu (Deň 1)

### 1.1 Inicializácia
- [ ] Vytvoriť GitHub/GitLab repozitár (private)
- [ ] Klonovať repozitár lokálne
- [ ] `npx create-payload-app@latest . --template with-vercel-postgres`
- [ ] Overiť, že `npm run dev` funguje

### 1.2 Inštalácia Závislostí
- [ ] `npm install stripe @stripe/stripe-js resend @cloudflare/stream-react`
- [ ] `npm install @capacitor/core`
- [ ] `npm install -D @capacitor/cli @capacitor/ios @capacitor/android`
- [ ] `npm install zod react-hook-form @hookform/resolvers`
- [ ] `npm install date-fns`

### 1.3 shadcn/ui Setup
- [ ] `npx shadcn@latest init`
- [ ] Vybrať štýl a farby
- [ ] `npx shadcn@latest add button card input label badge ...`

### 1.4 Environment Variables
- [ ] Vytvoriť `.env.example`
- [ ] Vytvoriť `.env.local` s testovacími hodnotami
- [ ] Overiť `.gitignore` obsahuje `.env.local`

### 1.5 Konfiguračný Systém
- [ ] Vytvoriť `src/config/site.config.ts`
- [ ] Vytvoriť `src/config/theme.config.ts`
- [ ] Vytvoriť `src/config/index.ts`
- [ ] Integrovať do `tailwind.config.ts`
- [ ] Pridať assets do `public/images/`

### 1.6 Databáza
- [ ] Vytvoriť Neon projekt
- [ ] Skopírovať connection string
- [ ] Pridať do `.env.local`
- [ ] Spustiť `npm run dev` - Payload vytvorí tabuľky

---

## Fáza 2: Backend & CMS (Deň 2-3)

### 2.1 Payload Kolekcie
- [ ] Vytvoriť `src/collections/Users.ts`
  - [ ] Auth enabled
  - [ ] firstName, lastName
  - [ ] stripeCustomerId
  - [ ] purchasedCourses relationship
  - [ ] roles (admin/customer)
  
- [ ] Vytvoriť `src/collections/Courses.ts`
  - [ ] title, slug, description
  - [ ] price, priceId
  - [ ] coverImage
  - [ ] status (draft/published)
  - [ ] modules array s lessons
  
- [ ] Vytvoriť `src/collections/Orders.ts`
  - [ ] stripeCheckoutId
  - [ ] user, course relationships
  - [ ] amount, status
  
- [ ] Vytvoriť `src/collections/Media.ts`
  - [ ] Upload konfigurácia
  - [ ] Image sizes

### 2.2 Payload Konfigurácia
- [ ] Aktualizovať `src/payload.config.ts`
- [ ] Pridať všetky kolekcie
- [ ] Nastaviť admin branding
- [ ] Overiť admin panel funguje (`/admin`)

### 2.3 Access Control
- [ ] Vytvoriť `src/access/isAdmin.ts`
- [ ] Vytvoriť `src/access/isAdminOrSelf.ts`
- [ ] Aplikovať na kolekcie

### 2.4 Seed Data (Voliteľné)
- [ ] Vytvoriť admin používateľa
- [ ] Vytvoriť testovací kurz
- [ ] Upload testovací obrázok

---

## Fáza 3: API Routes (Deň 3-4)

### 3.1 Stripe Integrácia
- [ ] Vytvoriť Stripe účet (test mode)
- [ ] Vytvoriť testovací produkt a price
- [ ] Vytvoriť `src/lib/stripe.ts`
- [ ] Vytvoriť `src/app/api/stripe/checkout/route.ts`
  - [ ] Auth overenie
  - [ ] Vytvorenie Checkout Session
  - [ ] Metadata s userId a courseId
- [ ] Vytvoriť `src/app/api/stripe/webhook/route.ts`
  - [ ] Signature verification
  - [ ] checkout.session.completed handler
  - [ ] Pridanie kurzu používateľovi
  - [ ] Vytvorenie Order záznamu
- [ ] Vytvoriť `src/app/api/stripe/portal/route.ts`

### 3.2 Testovanie Stripe
- [ ] Inštalovať Stripe CLI
- [ ] `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- [ ] Test checkout flow
- [ ] Overiť webhook prijatý a spracovaný
- [ ] Overiť používateľ má pridelený kurz

### 3.3 Video Token API
- [ ] Vytvoriť `src/lib/cloudflare-stream.ts`
- [ ] Implementovať `generateSignedToken()`
- [ ] Vytvoriť `src/app/api/video/token/route.ts`
- [ ] Test s reálnym Cloudflare video

### 3.4 User API
- [ ] Vytvoriť `src/app/api/users/me/route.ts`
- [ ] Overiť auth flow funguje

---

## Fáza 4: Email Systém (Deň 4)

### 4.1 Resend Setup
- [ ] Vytvoriť Resend účet
- [ ] Pridať a verifikovať doménu
- [ ] Skopírovať API key

### 4.2 Email Šablóny
- [ ] `npm install @react-email/components`
- [ ] Vytvoriť `src/emails/components/EmailLayout.tsx`
- [ ] Vytvoriť `src/emails/OrderConfirmationEmail.tsx`
- [ ] Vytvoriť `src/emails/WelcomeEmail.tsx`
- [ ] Vytvoriť `src/emails/ResetPasswordEmail.tsx`
- [ ] Vytvoriť `src/emails/MigrationWelcomeEmail.tsx`

### 4.3 Email Service
- [ ] Vytvoriť `src/lib/resend.ts`
- [ ] Vytvoriť `src/lib/email-service.ts`
- [ ] Implementovať send funkcie
- [ ] Test odoslanie emailu

### 4.4 Integrácia
- [ ] Pridať email do webhook handlera
- [ ] Pridať welcome email do Users hook

---

## Fáza 5: Frontend Stránky (Deň 5-7)

### 5.1 Layout
- [ ] Vytvoriť `src/components/layout/Header.tsx`
- [ ] Vytvoriť `src/components/layout/Footer.tsx`
- [ ] Vytvoriť `src/components/shared/Logo.tsx`
- [ ] Vytvoriť `src/app/(frontend)/layout.tsx`

### 5.2 Auth Stránky
- [ ] Vytvoriť `src/components/auth/LoginForm.tsx`
- [ ] Vytvoriť `src/components/auth/RegisterForm.tsx`
- [ ] Vytvoriť `src/app/(frontend)/login/page.tsx`
- [ ] Vytvoriť `src/app/(frontend)/register/page.tsx`
- [ ] Vytvoriť `src/app/(frontend)/reset-password/page.tsx`
- [ ] Test login/register flow

### 5.3 Homepage
- [ ] Vytvoriť `src/components/home/Hero.tsx`
- [ ] Vytvoriť `src/components/home/FeaturedCourses.tsx`
- [ ] Vytvoriť `src/components/home/Benefits.tsx`
- [ ] Vytvoriť `src/app/(frontend)/page.tsx`

### 5.4 Kurzy
- [ ] Vytvoriť `src/components/courses/CourseCard.tsx`
- [ ] Vytvoriť `src/components/courses/CourseGrid.tsx`
- [ ] Vytvoriť `src/components/courses/ModuleList.tsx`
- [ ] Vytvoriť `src/app/(frontend)/kurzy/page.tsx`
- [ ] Vytvoriť `src/app/(frontend)/kurzy/[slug]/page.tsx`

### 5.5 Checkout
- [ ] Vytvoriť `src/components/checkout/CheckoutButton.tsx`
- [ ] Integrovať do detail kurzu
- [ ] Test celý checkout flow

### 5.6 Lekcia (Video)
- [ ] Vytvoriť `src/components/video/VideoPlayer.tsx`
- [ ] Vytvoriť lekcia page s access control
- [ ] Test video playback
- [ ] Test signed URL expirácia

### 5.7 Dashboard
- [ ] Vytvoriť `src/app/(frontend)/dashboard/page.tsx`
- [ ] Zobraziť zakúpené kurzy
- [ ] Link na Customer Portal

### 5.8 Styling & Polish
- [ ] Responzívny dizajn (mobile first)
- [ ] Dark mode (voliteľné)
- [ ] Loading states
- [ ] Error states
- [ ] Toast notifications

---

## Fáza 6: Mobile App (Deň 8)

### 6.1 Capacitor Setup
- [ ] `npx cap init`
- [ ] Vytvoriť `capacitor.config.ts`
- [ ] `npx cap add ios`
- [ ] `npx cap add android`

### 6.2 CSS Úpravy
- [ ] Safe area padding
- [ ] Overscroll behavior: none
- [ ] User-select: none
- [ ] Tap highlight: transparent

### 6.3 Testing
- [ ] `npx cap sync`
- [ ] Test v iOS Simulátore
- [ ] Test v Android Emulátore
- [ ] Test na fyzickom zariadení

### 6.4 Assets
- [ ] Vytvoriť app icon (1024x1024)
- [ ] Vytvoriť splash screen (2732x2732)
- [ ] Generovať asset sizes

---

## Fáza 7: Migrácia & Testing (Deň 9-10)

### 7.1 Migračný Skript
- [ ] Vytvoriť `scripts/migrate-kajabi-users.ts`
- [ ] Pripraviť Kajabi CSV export
- [ ] Vytvoriť mapovanie kurzov
- [ ] Dry run test
- [ ] Produkčná migrácia (ak aplikovateľné)

### 7.2 Testovanie
- [ ] E2E test: Registrácia
- [ ] E2E test: Login
- [ ] E2E test: Checkout
- [ ] E2E test: Video playback
- [ ] E2E test: Password reset
- [ ] Test na mobile
- [ ] Test platby s rôznymi kartami

### 7.3 Security Review
- [ ] Overiť access control
- [ ] Overiť webhook signature
- [ ] Overiť video signed URLs
- [ ] Skontrolovať exposed env variables

---

## Fáza 8: Deployment (Deň 10-11)

### 8.1 Vercel Setup
- [ ] Pripojiť GitHub repo
- [ ] Nastaviť environment variables
- [ ] Deploy

### 8.2 Stripe Production
- [ ] Aktivovať live mode
- [ ] Vytvoriť produkčné produkty/ceny
- [ ] Nastaviť produkčný webhook
- [ ] Aktualizovať env variables

### 8.3 Doména
- [ ] Pridať doménu v Vercel
- [ ] Nastaviť DNS záznamy
- [ ] Overiť SSL funguje

### 8.4 Final Testing
- [ ] Test na produkčnej doméne
- [ ] Test platby (malá suma)
- [ ] Test webhook
- [ ] Test emaily
- [ ] Test video

### 8.5 Mobile Submission (Voliteľné)
- [ ] iOS: TestFlight
- [ ] Android: Internal testing

---

## Fáza 9: Go-Live & Handoff (Deň 11)

### 9.1 Admin Setup
- [ ] Vytvoriť admin účet pre klientku
- [ ] Nahrať kurzy a videá
- [ ] Nastaviť Stripe produkty

### 9.2 Dokumentácia
- [ ] Admin guide pre klientku
- [ ] Ako pridať kurz
- [ ] Ako nahrať video
- [ ] Ako spravovať používateľov

### 9.3 Monitoring
- [ ] Zapnúť Vercel Analytics
- [ ] Nastaviť error alerting
- [ ] Nastaviť uptime monitoring

### 9.4 Handoff
- [ ] Predať prístupy klientke
- [ ] Školenie na admin panel
- [ ] Support kontakt

---

## 📊 Progress Tracker

```
Fáza 1: Setup          [░░░░░░░░░░] 0%
Fáza 2: Backend        [░░░░░░░░░░] 0%
Fáza 3: API            [░░░░░░░░░░] 0%
Fáza 4: Email          [░░░░░░░░░░] 0%
Fáza 5: Frontend       [░░░░░░░░░░] 0%
Fáza 6: Mobile         [░░░░░░░░░░] 0%
Fáza 7: Migrácia       [░░░░░░░░░░] 0%
Fáza 8: Deployment     [░░░░░░░░░░] 0%
Fáza 9: Go-Live        [░░░░░░░░░░] 0%

CELKOVO: 0%
```

---

## ⏱️ Časový Odhad

| Fáza | Úlohy | Odhad |
|------|-------|-------|
| 1. Setup | Inicializácia, deps, DB | 1 deň |
| 2. Backend | Kolekcie, Payload config | 1-2 dni |
| 3. API | Stripe, Video, Auth | 1-2 dni |
| 4. Email | Resend, šablóny | 0.5 dňa |
| 5. Frontend | Stránky, komponenty | 3-4 dni |
| 6. Mobile | Capacitor, CSS | 1 deň |
| 7. Migrácia | Skript, testovanie | 1 deň |
| 8. Deployment | Vercel, DNS, produkcia | 1 deň |
| 9. Go-Live | Admin, dokumentácia | 0.5 dňa |
| **SPOLU** | | **10-13 dní** |

---

## 🚨 Kritické Body

1. **Stripe Webhook** - Musí fungovať 100%, inak zákazníci nedostanú prístup
2. **Video Signed URLs** - Ochrana obsahu, bez toho je obsah zraniteľný
3. **Auth Flow** - Login/Register/Reset musia byť bezchybné
4. **Mobile CSS** - Safe areas a overscroll pre natívny pocit
5. **Email Delivery** - Verifikovaná doména pre doručiteľnosť

---

*Systematický prístup k implementácii zabezpečí kvalitný výsledok.*

