# ⚡ Performance Optimization

## Cieľové Metriky (Core Web Vitals)

| Metrika | Cieľ | Popis |
|---------|------|-------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **FID** | < 100ms | First Input Delay |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **TTFB** | < 600ms | Time to First Byte |
| **FCP** | < 1.8s | First Contentful Paint |

```
Target Lighthouse Scores:
┌────────────────────────────────────────┐
│ Performance:    95+ ████████████████▓░ │
│ Accessibility:  95+ ████████████████▓░ │
│ Best Practices: 95+ ████████████████▓░ │
│ SEO:            95+ ████████████████▓░ │
└────────────────────────────────────────┘
```

---

## 1. Server Components (Default)

Next.js 15 App Router používa Server Components ako default.

```typescript
// ✅ SPRÁVNE - Server Component (default)
// src/app/(frontend)/kurzy/page.tsx
import { getPayload } from 'payload'
import { CourseGrid } from '@/components/courses/CourseGrid'

export default async function CoursesPage() {
  const payload = await getPayload({ config: configPromise })
  
  const courses = await payload.find({
    collection: 'courses',
    where: { status: { equals: 'published' } },
  })

  // Žiadny JS sa neposiela na klienta!
  return <CourseGrid courses={courses.docs} />
}
```

```typescript
// ⚠️ Client Component - len keď potrebujeme interaktivitu
// src/components/checkout/CheckoutButton.tsx
'use client'

import { useState } from 'react'

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  // ...
}
```

### Pravidlá

| Použiť Server Component | Použiť Client Component |
|------------------------|------------------------|
| Fetch data | useState, useEffect |
| Prístup k backendu | Event listeners (onClick) |
| Citlivé údaje (API keys) | Browser APIs |
| Veľké dependencie | Interaktívne UI |

---

## 2. Image Optimization

### next/image Component

```typescript
// src/components/courses/CourseCard.tsx
import Image from 'next/image'

export function CourseCard({ course }: Props) {
  return (
    <div className="relative aspect-video">
      <Image
        src={course.coverImage.url}
        alt={course.coverImage.alt || course.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        // Priorita pre above-the-fold obrázky
        priority={false}
        // Placeholder
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      />
    </div>
  )
}
```

### Next.js Config

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    // Moderné formáty
    formats: ['image/avif', 'image/webp'],
    
    // Remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudflarestream.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    
    // Device sizes pre srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### Lazy Loading pre Below-the-fold

```typescript
// Obrázky pod "záhybom" sa načítajú lazy
<Image
  src={image.url}
  alt={image.alt}
  fill
  loading="lazy" // Default pre non-priority
/>
```

---

## 3. Font Optimization

### next/font (Zero Layout Shift)

```typescript
// src/app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'

// Body font
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
})

// Heading font
const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({ children }: Props) {
  return (
    <html lang="sk" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body">
        {children}
      </body>
    </html>
  )
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        heading: ['var(--font-heading)', 'serif'],
      },
    },
  },
}
```

---

## 4. Code Splitting & Lazy Loading

### Dynamic Imports

```typescript
// Lazy load ťažké komponenty
import dynamic from 'next/dynamic'

// Video player - načíta sa len keď je potrebný
const VideoPlayer = dynamic(
  () => import('@/components/video/VideoPlayer'),
  {
    loading: () => <VideoSkeleton />,
    ssr: false, // Klient-only
  }
)

// Heavy charts
const Analytics = dynamic(
  () => import('@/components/dashboard/Analytics'),
  { loading: () => <Skeleton /> }
)
```

### Route Segments

```typescript
// Každá stránka je automaticky code-split
// src/app/(frontend)/kurzy/[slug]/page.tsx
// → Samostatný JS bundle
```

---

## 5. Caching Strategy

### Static Generation (Default)

```typescript
// Stránky sa generujú pri builde
// src/app/(frontend)/kurzy/page.tsx
export const revalidate = 3600 // Revalidate každú hodinu
```

### Dynamic s Cache

```typescript
// Fetch s cache
const courses = await fetch('/api/courses', {
  next: { revalidate: 3600 }
})
```

### generateStaticParams

```typescript
// Pre-render všetky kurzy pri builde
// src/app/(frontend)/kurzy/[slug]/page.tsx
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  const courses = await payload.find({
    collection: 'courses',
    where: { status: { equals: 'published' } },
  })

  return courses.docs.map((course) => ({
    slug: course.slug,
  }))
}
```

### Cache Headers

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      // Static assets - dlhý cache
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // JS/CSS bundles
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API routes - no cache
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}
```

---

## 6. Bundle Analysis

### Inštalácia

```bash
npm install @next/bundle-analyzer
```

### Konfigurácia

```typescript
// next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
```

### Použitie

```bash
ANALYZE=true npm run build
```

---

## 7. Skeleton Loading

### Skeleton Component

```typescript
// src/components/ui/skeleton.tsx
import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}
```

### Course Card Skeleton

```typescript
// src/components/courses/CourseCardSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export function CourseCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border">
      <Skeleton className="aspect-video" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
```

### Loading.tsx (Automatic)

```typescript
// src/app/(frontend)/kurzy/loading.tsx
import { CourseCardSkeleton } from '@/components/courses/CourseCardSkeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
```

---

## 8. Preloading & Prefetching

### Link Prefetching

```typescript
// Next.js Link automaticky prefetchuje
import Link from 'next/link'

<Link href="/kurzy/permanentny-makeup">
  Permanentný Makeup
</Link>

// Vypnúť prefetch pre menej dôležité linky
<Link href="/obchodne-podmienky" prefetch={false}>
  Obchodné podmienky
</Link>
```

### Resource Hints

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: Props) {
  return (
    <html>
      <head>
        {/* Preconnect k dôležitým doménam */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://customer-xxx.cloudflarestream.com" />
        
        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://js.stripe.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 9. Third-party Scripts

### Lazy Loading Scripts

```typescript
// src/app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        {children}
        
        {/* Google Analytics - lazy */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXX"
          strategy="lazyOnload"
        />
        
        {/* Stripe - after interactive */}
        <Script
          src="https://js.stripe.com/v3/"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
```

---

## 10. Monitoring

### Vercel Analytics

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Custom Web Vitals

```typescript
// src/app/layout.tsx
export function reportWebVitals(metric: any) {
  console.log(metric)
  
  // Poslať na analytics
  // sendToAnalytics(metric)
}
```

---

## 📋 Performance Checklist

### Build Time
- [ ] Images optimized (WebP/AVIF)
- [ ] Fonts preloaded (next/font)
- [ ] Bundle size < 200KB (gzipped)
- [ ] Tree shaking enabled
- [ ] Unused dependencies removed

### Runtime
- [ ] Server Components kde možné
- [ ] Dynamic imports pre ťažké komponenty
- [ ] Skeleton loading states
- [ ] Proper cache headers
- [ ] Preconnect k externým doménam

### Measurement
- [ ] Lighthouse > 90 všetky metriky
- [ ] Core Web Vitals passing
- [ ] Vercel Analytics enabled
- [ ] Real User Monitoring

---

## 🧪 Testovanie

### Lighthouse

```bash
# Chrome DevTools → Lighthouse tab
# Alebo CLI
npm install -g lighthouse
lighthouse https://vasa-domena.sk --view
```

### WebPageTest

```
https://webpagetest.org/
```

### PageSpeed Insights

```
https://pagespeed.web.dev/
```

---

*Performance je feature. Rýchla stránka = lepšie konverzie.*

