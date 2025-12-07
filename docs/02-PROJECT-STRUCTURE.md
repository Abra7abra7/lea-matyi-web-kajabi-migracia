# 📁 Štruktúra Projektu

## Kompletná Adresárová Štruktúra

```
beauty-academy/
├── 📁 src/
│   ├── 📁 app/                          # Next.js App Router
│   │   ├── 📁 (frontend)/               # Frontend route group
│   │   │   ├── 📁 kurzy/
│   │   │   │   ├── page.tsx             # /kurzy - zoznam kurzov
│   │   │   │   └── 📁 [slug]/
│   │   │   │       ├── page.tsx         # /kurzy/[slug] - detail kurzu
│   │   │   │       └── 📁 lekcia/
│   │   │   │           └── 📁 [moduleIndex]/
│   │   │   │               └── 📁 [lessonIndex]/
│   │   │   │                   └── page.tsx  # Lekcia s videom
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── page.tsx             # /dashboard - moje kurzy
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx             # /login
│   │   │   ├── 📁 register/
│   │   │   │   └── page.tsx             # /register
│   │   │   ├── 📁 reset-password/
│   │   │   │   └── page.tsx             # /reset-password
│   │   │   ├── layout.tsx               # Frontend layout
│   │   │   └── page.tsx                 # / - homepage
│   │   │
│   │   ├── 📁 (payload)/                # Payload Admin route group
│   │   │   ├── 📁 admin/
│   │   │   │   └── 📁 [[...segments]]/
│   │   │   │       └── page.tsx         # /admin - Payload panel
│   │   │   └── layout.tsx
│   │   │
│   │   ├── 📁 api/                      # API Routes
│   │   │   ├── 📁 stripe/
│   │   │   │   ├── 📁 checkout/
│   │   │   │   │   └── route.ts         # POST - create checkout
│   │   │   │   └── 📁 webhook/
│   │   │   │       └── route.ts         # POST - Stripe webhooks
│   │   │   ├── 📁 video/
│   │   │   │   └── 📁 token/
│   │   │   │       └── route.ts         # GET - signed video token
│   │   │   └── 📁 [...payload]/         # Payload API routes
│   │   │       └── route.ts
│   │   │
│   │   ├── globals.css                  # Global styles + Tailwind
│   │   ├── layout.tsx                   # Root layout
│   │   └── not-found.tsx                # 404 page
│   │
│   ├── 📁 config/                       # Konfigurácia (EDITOVAŤ PRE KLIENTA)
│   │   ├── site.config.ts               # Údaje o firme, texty, navigácia
│   │   ├── theme.config.ts              # Farby, fonty, štýly
│   │   └── index.ts                     # Export + helpers
│   │
│   ├── 📁 collections/                  # Payload CMS Collections
│   │   ├── Users.ts                     # Users kolekcia
│   │   ├── Courses.ts                   # Courses kolekcia
│   │   ├── Orders.ts                    # Orders kolekcia
│   │   └── Media.ts                     # Media kolekcia
│   │
│   ├── 📁 components/                   # React komponenty
│   │   ├── 📁 ui/                       # shadcn/ui komponenty
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── 📁 layout/                   # Layout komponenty
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   ├── 📁 courses/                  # Course komponenty
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseGrid.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   ├── ModuleList.tsx
│   │   │   ├── LessonItem.tsx
│   │   │   └── CourseProgress.tsx
│   │   │
│   │   ├── 📁 video/                    # Video komponenty
│   │   │   ├── VideoPlayer.tsx          # Cloudflare Stream player
│   │   │   ├── VideoSkeleton.tsx
│   │   │   └── VideoControls.tsx
│   │   │
│   │   ├── 📁 auth/                     # Auth komponenty
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ResetPasswordForm.tsx
│   │   │
│   │   ├── 📁 checkout/                 # Checkout komponenty
│   │   │   ├── CheckoutButton.tsx
│   │   │   ├── PricingCard.tsx
│   │   │   └── OrderConfirmation.tsx
│   │   │
│   │   └── 📁 shared/                   # Zdieľané komponenty
│   │       ├── Logo.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── 📁 lib/                          # Utility funkcie
│   │   ├── payload.ts                   # Payload client
│   │   ├── stripe.ts                    # Stripe client
│   │   ├── resend.ts                    # Resend client
│   │   ├── cloudflare-stream.ts         # CF Stream signing
│   │   ├── utils.ts                     # cn() a helpers
│   │   └── validations.ts               # Zod schémy
│   │
│   ├── 📁 hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   ├── useCheckout.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── 📁 emails/                       # Email šablóny (React Email)
│   │   ├── WelcomeEmail.tsx
│   │   ├── OrderConfirmationEmail.tsx
│   │   ├── ResetPasswordEmail.tsx
│   │   └── MigrationWelcomeEmail.tsx
│   │
│   ├── 📁 types/                        # TypeScript typy
│   │   ├── payload-types.ts             # Auto-generated
│   │   └── index.ts                     # Custom typy
│   │
│   ├── 📁 access/                       # Payload access control
│   │   ├── isAdmin.ts
│   │   ├── isAdminOrSelf.ts
│   │   └── hasPurchased.ts
│   │
│   └── payload.config.ts                # Payload konfigurácia
│
├── 📁 public/                           # Statické súbory
│   ├── 📁 images/
│   │   ├── logo.svg
│   │   ├── logo-dark.svg
│   │   └── hero-bg.jpg
│   ├── 📁 fonts/
│   │   └── ...
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── manifest.json
│
├── 📁 scripts/                          # Utility skripty
│   ├── migrate-kajabi-users.ts          # Migrácia z Kajabi
│   ├── seed-courses.ts                  # Seed dát
│   └── generate-sitemap.ts              # Sitemap generátor
│
├── 📁 ios/                              # Capacitor iOS (generované)
├── 📁 android/                          # Capacitor Android (generované)
│
├── 📁 docs/                             # Dokumentácia
│   ├── 00-PROJECT-OVERVIEW.md
│   ├── 01-TECH-STACK.md
│   └── ...
│
├── .env.example                         # Template pre env vars
├── .env.local                           # Lokálne env vars (gitignore)
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── capacitor.config.ts                  # Capacitor konfigurácia
├── components.json                      # shadcn/ui konfigurácia
├── next.config.ts                       # Next.js konfigurácia
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 📂 Detailný Popis Adresárov

### `/src/app/` - Next.js App Router

Používame **Route Groups** `(frontend)` a `(payload)` na oddelenie:
- Frontend stránky pre zákazníkov
- Admin panel (Payload CMS)

```
(frontend)/           # Nepridáva sa do URL
├── kurzy/           # → /kurzy
├── dashboard/       # → /dashboard
└── login/           # → /login

(payload)/
└── admin/           # → /admin (Payload CMS)
```

### `/src/collections/` - Payload CMS Kolekcie

Definície dátových modelov pre Payload CMS:
- **Users.ts** - Používatelia s auth
- **Courses.ts** - Kurzy s modulmi a lekciami
- **Orders.ts** - Objednávky
- **Media.ts** - Uploaded súbory

### `/src/components/` - React Komponenty

Organizácia podľa funkcionality:
- **ui/** - Základné UI komponenty (shadcn/ui)
- **layout/** - Layoutové komponenty
- **courses/** - Komponenty pre kurzy
- **video/** - Video player a súvisiace
- **auth/** - Formuláre pre autentifikáciu
- **checkout/** - Platobné komponenty
- **shared/** - Zdieľané utility komponenty

### `/src/lib/` - Utility Funkcie

Singleton inštancie a helper funkcie:
- **payload.ts** - Payload Local API client
- **stripe.ts** - Stripe SDK instance
- **resend.ts** - Resend email client
- **cloudflare-stream.ts** - Video token signing
- **utils.ts** - `cn()` funkcia pre className merge

### `/src/emails/` - Email Šablóny

React Email komponenty pre:
- Welcome email po registrácii
- Potvrdenie objednávky
- Reset hesla
- Migračný welcome email

---

## 🔀 Routing Mapa

| URL | Súbor | Popis |
|-----|-------|-------|
| `/` | `(frontend)/page.tsx` | Homepage |
| `/kurzy` | `(frontend)/kurzy/page.tsx` | Zoznam kurzov |
| `/kurzy/[slug]` | `(frontend)/kurzy/[slug]/page.tsx` | Detail kurzu |
| `/kurzy/[slug]/lekcia/[m]/[l]` | `...lekcia/[moduleIndex]/[lessonIndex]/page.tsx` | Video lekcia |
| `/dashboard` | `(frontend)/dashboard/page.tsx` | Moje kurzy |
| `/login` | `(frontend)/login/page.tsx` | Prihlásenie |
| `/register` | `(frontend)/register/page.tsx` | Registrácia |
| `/reset-password` | `(frontend)/reset-password/page.tsx` | Reset hesla |
| `/admin/*` | `(payload)/admin/[[...segments]]/page.tsx` | Payload Admin |
| `/api/stripe/checkout` | `api/stripe/checkout/route.ts` | Stripe checkout |
| `/api/stripe/webhook` | `api/stripe/webhook/route.ts` | Stripe webhooks |

---

## 📝 Naming Conventions

### Súbory
- **Komponenty:** PascalCase (`CourseCard.tsx`)
- **Utilities:** camelCase (`utils.ts`)
- **Kolekcie:** PascalCase (`Users.ts`)
- **API Routes:** lowercase (`route.ts`)

### Premenné & Funkcie
- **Komponenty:** PascalCase (`function CourseCard()`)
- **Hooks:** camelCase s `use` prefix (`useAuth`)
- **Utilities:** camelCase (`formatPrice()`)
- **Constants:** SCREAMING_SNAKE_CASE (`API_BASE_URL`)

### CSS Classes
- **Tailwind:** utility-first
- **Custom:** kebab-case (`.course-card`)

---

## 🎨 Komponenty - Conventions

```tsx
// src/components/courses/CourseCard.tsx

// 1. Imports - external first, then internal
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Course } from '@/types/payload-types'

// 2. Props interface
interface CourseCardProps {
  course: Course
  showPrice?: boolean
  className?: string
}

// 3. Component
export function CourseCard({ 
  course, 
  showPrice = true,
  className 
}: CourseCardProps) {
  return (
    <Card className={className}>
      {/* ... */}
    </Card>
  )
}

// 4. Display name (pre debugging)
CourseCard.displayName = 'CourseCard'
```

---

## 📦 Import Aliases

```typescript
// tsconfig.json paths
{
  "@/*": ["./src/*"],
  "@payload-config": ["./src/payload.config.ts"]
}

// Použitie
import { Button } from '@/components/ui/button'
import { Users } from '@/collections/Users'
import payloadConfig from '@payload-config'
```

---

*Štruktúra navrhnutá pre škálovateľnosť a jednoduchú orientáciu.*

