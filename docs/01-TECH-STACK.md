# 🛠️ Tech Stack & Verzie

## Prehľad Technológií

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  Next.js 15 + React 19 + Tailwind CSS v4 + shadcn/ui           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND / CMS                              │
│              Payload CMS 3.0 (Native Next.js)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABÁZA                                 │
│                PostgreSQL (Neon.tech)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNÉ SLUŽBY                             │
│  Stripe │ Cloudflare Stream │ Resend │ Vercel                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MOBILE                                  │
│                    Capacitor (iOS/Android)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Presné Verzie Závislostí

### Core Framework

| Technológia | Verzia | NPM Package | Poznámka |
|-------------|--------|-------------|----------|
| **Next.js** | `15.1.x` | `next` | App Router, Server Components |
| **React** | `19.x` | `react`, `react-dom` | Concurrent features |
| **TypeScript** | `5.x` | `typescript` | Strict mode |
| **Node.js** | `20.x LTS` | - | Minimum požiadavka |

### Backend & CMS

| Technológia | Verzia | NPM Package | Poznámka |
|-------------|--------|-------------|----------|
| **Payload CMS** | `3.x` | `payload` | Native Next.js integrácia |
| **@payloadcms/next** | `3.x` | `@payloadcms/next` | Next.js plugin |
| **@payloadcms/db-postgres** | `3.x` | `@payloadcms/db-postgres` | PostgreSQL adapter |
| **@payloadcms/richtext-lexical** | `3.x` | `@payloadcms/richtext-lexical` | Rich text editor |

### UI & Styling

| Technológia | Verzia | NPM Package | Poznámka |
|-------------|--------|-------------|----------|
| **Tailwind CSS** | `4.x` | `tailwindcss` | Utility-first CSS |
| **shadcn/ui** | `latest` | `@shadcn/ui` (CLI) | Komponentová knižnica |
| **Lucide React** | `latest` | `lucide-react` | Ikony |
| **class-variance-authority** | `latest` | `class-variance-authority` | Pre shadcn |
| **clsx** | `latest` | `clsx` | Utility pre className |
| **tailwind-merge** | `latest` | `tailwind-merge` | Merge Tailwind classes |

### Platby

| Technológia | Verzia | NPM Package | Poznámka |
|-------------|--------|-------------|----------|
| **Stripe Node.js** | `17.x` | `stripe` | Backend SDK |
| **@stripe/stripe-js** | `4.x` | `@stripe/stripe-js` | Frontend SDK |

### Email

| Technológia | Verzia | NPM Package | Poznámka |
|-------------|--------|-------------|----------|
| **Resend** | `4.x` | `resend` | Transakčné emaily |
| **React Email** | `latest` | `@react-email/components` | Email šablóny |

### Video Streaming

| Technológia | Verzia | NPM Package | Poznámka |
|-------------|--------|-------------|----------|
| **Cloudflare Stream** | `latest` | `@cloudflare/stream-react` | Video player |

### Mobile

| Technológia | Verzia | NPM Package | Poznámka |
|-------------|--------|-------------|----------|
| **Capacitor Core** | `6.x` | `@capacitor/core` | Core runtime |
| **Capacitor CLI** | `6.x` | `@capacitor/cli` | CLI nástroje |
| **Capacitor iOS** | `6.x` | `@capacitor/ios` | iOS platform |
| **Capacitor Android** | `6.x` | `@capacitor/android` | Android platform |

### Dev Tools

| Technológia | Verzia | NPM Package | Poznámka |
|-------------|--------|-------------|----------|
| **ESLint** | `9.x` | `eslint` | Linting |
| **Prettier** | `3.x` | `prettier` | Formátovanie |
| **drizzle-kit** | `latest` | `drizzle-kit` | DB migrations (voliteľné) |

---

## 📋 package.json Template

```json
{
  "name": "beauty-academy",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "payload": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload",
    "generate:types": "payload generate:types",
    "db:push": "payload migrate"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    
    "payload": "^3.0.0",
    "@payloadcms/next": "^3.0.0",
    "@payloadcms/db-postgres": "^3.0.0",
    "@payloadcms/richtext-lexical": "^3.0.0",
    "@payloadcms/plugin-cloud-storage": "^3.0.0",
    
    "stripe": "^17.0.0",
    "@stripe/stripe-js": "^4.0.0",
    
    "resend": "^4.0.0",
    "@react-email/components": "^0.0.25",
    
    "@cloudflare/stream-react": "^1.9.0",
    
    "tailwindcss": "^4.0.0",
    "lucide-react": "^0.460.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    
    "@capacitor/core": "^6.0.0",
    
    "zod": "^3.23.0",
    "date-fns": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.1.0",
    "prettier": "^3.4.0",
    "prettier-plugin-tailwindcss": "^0.6.0",
    
    "@capacitor/cli": "^6.0.0",
    "@capacitor/ios": "^6.0.0",
    "@capacitor/android": "^6.0.0",
    
    "cross-env": "^7.0.3"
  }
}
```

---

## 🔧 Konfiguračné Súbory

### tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    },
    "target": "ES2017"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.ts

```typescript
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'customer-*.cloudflarestream.com',
      },
    ],
  },
}

export default withPayload(nextConfig)
```

---

## 🌐 Externé Služby - Účty

| Služba | Účel | URL | Potrebné |
|--------|------|-----|----------|
| **Vercel** | Hosting | vercel.com | Account + Team |
| **Neon** | PostgreSQL DB | neon.tech | Database |
| **Stripe** | Platby | stripe.com | Account + Keys |
| **Cloudflare** | Video | cloudflare.com | Account + Stream |
| **Resend** | Email | resend.com | Account + API Key |
| **GitHub** | Repo | github.com | Private repo |

---

## ⚠️ Dôležité Poznámky

1. **Node.js 20+** je povinné pre Next.js 15
2. **Payload CMS 3.0** vyžaduje Next.js 14+ a natívne beží v rámci Next.js
3. **Tailwind CSS v4** používa nový spôsob konfigurácie (CSS-based)
4. **React 19** je RC verzia - sledujte stabilitu
5. **shadcn/ui** nie je npm balík, inštaluje sa cez CLI

---

*Verzie aktualizované: December 2024*

