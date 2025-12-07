# 🎨 Konfigurovateľný Dizajn Systém

## Prehľad

Systém umožňuje jednoduché prispôsobenie vizuálu a údajov o klientovi bez zásahu do kódu komponentov. Ideálne pre duplikovanie projektu pre nových klientov.

```
┌─────────────────────────────────────────────────────────────────┐
│                    KONFIGURAČNÉ SÚBORY                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  site.config    │  │  theme.config   │  │     assets      │  │
│  │  (údaje)        │  │  (farby)        │  │  (logo, img)    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    KOMPONENTY                                    │
│         (Automaticky používajú konfiguráciu)                    │
└─────────────────────────────────────────────────────────────────┘
```

**Pre zmenu klienta/vizuálu upravte LEN:**
- `src/config/site.config.ts` - údaje o firme, texty
- `src/config/theme.config.ts` - farby, fonty
- `public/images/` - logo, obrázky

---

## 1. Štruktúra Konfiguračných Súborov

```
src/config/
├── site.config.ts      # Všetky údaje o klientovi
├── theme.config.ts     # Farby, fonty, spacing
└── index.ts            # Export všetkého
```

---

## 2. Site Config (Údaje o Klientovi)

```typescript
// src/config/site.config.ts

export const siteConfig = {
  // ═══════════════════════════════════════════════════════════
  // ZÁKLADNÉ ÚDAJE
  // ═══════════════════════════════════════════════════════════
  name: 'Beauty Academy',
  shortName: 'BA',
  description: 'Profesionálne online kurzy v oblasti beauty',
  tagline: 'Staňte sa profesionálom v beauty priemysle',
  
  // URL (bez trailing slash)
  url: 'https://beautyacademy.sk',
  
  // ═══════════════════════════════════════════════════════════
  // KONTAKTNÉ ÚDAJE
  // ═══════════════════════════════════════════════════════════
  contact: {
    email: 'info@beautyacademy.sk',
    phone: '+421 900 123 456',
    address: 'Hlavná 123, 811 01 Bratislava',
  },
  
  // ═══════════════════════════════════════════════════════════
  // SOCIÁLNE SIETE (null = nezobrazí sa)
  // ═══════════════════════════════════════════════════════════
  social: {
    instagram: 'https://instagram.com/beautyacademy',
    facebook: 'https://facebook.com/beautyacademy',
    youtube: 'https://youtube.com/@beautyacademy',
    tiktok: null,
    linkedin: null,
    twitter: null,
  },
  
  // ═══════════════════════════════════════════════════════════
  // FIREMNÉ ÚDAJE (pre faktúry, pätu, GDPR)
  // ═══════════════════════════════════════════════════════════
  company: {
    legalName: 'Beauty Academy s.r.o.',
    ico: '12345678',
    dic: '2012345678',
    icDph: 'SK2012345678', // null ak nie je platca DPH
    bankAccount: 'SK89 1234 5678 9012 3456 7890',
    bankName: 'Tatra banka',
    registeredAt: 'Obchodný register OS Bratislava I, oddiel Sro, vložka č. 12345/B',
  },
  
  // ═══════════════════════════════════════════════════════════
  // MOBILNÁ APLIKÁCIA
  // ═══════════════════════════════════════════════════════════
  app: {
    id: 'sk.beautyacademy.app',
    name: 'Beauty Academy',
    iosUrl: null, // App Store URL po publikovaní
    androidUrl: null, // Play Store URL po publikovaní
  },
  
  // ═══════════════════════════════════════════════════════════
  // SEO & META
  // ═══════════════════════════════════════════════════════════
  seo: {
    defaultTitle: 'Beauty Academy | Online kurzy beauty',
    titleTemplate: '%s | Beauty Academy',
    description: 'Profesionálne online kurzy permanentného makeupu, nail art a ďalších beauty techník. Učte sa vlastným tempom od najlepších.',
    ogImage: '/images/og-image.jpg',
    locale: 'sk_SK',
    googleAnalyticsId: null, // 'G-XXXXXXXXXX'
  },
  
  // ═══════════════════════════════════════════════════════════
  // TEXTY NA STRÁNKACH
  // (Ľahko editovateľné bez zásahu do komponentov)
  // ═══════════════════════════════════════════════════════════
  content: {
    // Hero sekcia
    hero: {
      badge: 'Online vzdelávanie v oblasti beauty',
      title: 'Staňte sa profesionálom v',
      titleHighlight: 'beauty priemysle',
      subtitle: 'Profesionálne online kurzy permanentného makeupu, nail art a ďalších beauty techník. Učte sa vlastným tempom od najlepších odborníkov v odbore.',
    },
    
    // Štatistiky
    stats: {
      students: { value: '500+', label: 'Spokojných študentov' },
      courses: { value: '15+', label: 'Profesionálnych kurzov' },
      satisfaction: { value: '100%', label: 'Online prístup' },
    },
    
    // CTA tlačidlá
    cta: {
      viewCourses: 'Prezrieť kurzy',
      watchDemo: 'Pozrieť ukážku',
      buyNow: 'Kúpiť teraz',
      startLearning: 'Začať študovať',
      continueWatching: 'Pokračovať',
    },
    
    // Výhody/Benefits
    benefits: [
      {
        title: 'Doživotný prístup',
        description: 'K zakúpeným kurzom máte prístup navždy.',
      },
      {
        title: 'Certifikát',
        description: 'Po dokončení kurzu získate certifikát.',
      },
      {
        title: 'Mobilná aplikácia',
        description: 'Učte sa kdekoľvek v našej mobilnej appke.',
      },
      {
        title: 'Materiály na stiahnutie',
        description: 'PDF materiály a pracovné listy.',
      },
    ],
    
    // Footer
    footer: {
      description: 'Profesionálne online kurzy v oblasti beauty. Učte sa od najlepších odborníkov z pohodlia domova.',
      copyright: '© {year} {company}. Všetky práva vyhradené.',
    },
    
    // Empty states
    empty: {
      noCourses: 'Momentálne nie sú dostupné žiadne kurzy.',
      noOwnedCourses: 'Zatiaľ nemáte žiadne kurzy',
      noOwnedCoursesDescription: 'Prezrite si našu ponuku a začnite sa učiť už dnes.',
    },
    
    // Success/Error messages
    messages: {
      purchaseSuccess: 'Ďakujeme za nákup! Kurz je teraz odomknutý.',
      purchaseCanceled: 'Platba bola zrušená. Môžete to skúsiť znova.',
      accessDenied: 'Pre prístup k tomuto kurzu ho musíte najprv zakúpiť.',
      loginRequired: 'Pre túto akciu musíte byť prihlásený.',
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // FUNKCIE (zapnúť/vypnúť)
  // ═══════════════════════════════════════════════════════════
  features: {
    darkMode: true,
    newsletter: false,
    testimonials: true,
    blog: false,
    liveChat: false,
    courseProgress: true,
    certificates: true,
    mobileApp: true,
  },
  
  // ═══════════════════════════════════════════════════════════
  // NAVIGÁCIA
  // ═══════════════════════════════════════════════════════════
  navigation: {
    main: [
      { label: 'Kurzy', href: '/kurzy' },
      { label: 'O nás', href: '/o-nas' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    footer: [
      { label: 'Obchodné podmienky', href: '/obchodne-podmienky' },
      { label: 'Ochrana osobných údajov', href: '/ochrana-osobnych-udajov' },
      { label: 'Reklamačný poriadok', href: '/reklamacny-poriadok' },
    ],
  },
} as const

// Export type pre TypeScript autocomplete
export type SiteConfig = typeof siteConfig
```

---

## 3. Theme Config (Farby & Štýly)

```typescript
// src/config/theme.config.ts

export const themeConfig = {
  // ═══════════════════════════════════════════════════════════
  // FARBY - Primárna paleta
  // Použite nástroj ako https://uicolors.app pre generovanie
  // ═══════════════════════════════════════════════════════════
  colors: {
    // Primárna farba (hlavná akcent farba celej stránky)
    // Ružová pre beauty - zmeňte podľa klienta
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',  // ← Hlavná odtieň
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724',
    },
    
    // Sekundárna farba (pre akcenty, badges)
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },
    
    // Akcent farba (pre highlight, upozornenia)
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    
    // Success (zelená)
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      700: '#15803d',
    },
    
    // Error (červená)
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      700: '#b91c1c',
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // GRADIENTY
  // ═══════════════════════════════════════════════════════════
  gradients: {
    // Hero pozadie (light mode)
    hero: 'from-pink-50 via-white to-rose-50',
    // Hero pozadie (dark mode)
    heroDark: 'from-gray-900 via-gray-800 to-gray-900',
    
    // Text gradient (pre titulky)
    text: 'from-pink-500 to-rose-500',
    textAlt: 'from-pink-500 to-purple-500',
    
    // Button gradient
    button: 'from-pink-500 to-pink-600',
    buttonHover: 'from-pink-600 to-pink-700',
    
    // Card overlay
    cardOverlay: 'from-black/60 to-transparent',
  },
  
  // ═══════════════════════════════════════════════════════════
  // FONTY
  // Google Fonts - pridajte do layout.tsx cez next/font
  // ═══════════════════════════════════════════════════════════
  fonts: {
    // Nadpisy
    heading: {
      name: 'Playfair Display',
      weights: [400, 500, 600, 700],
      fallback: 'serif',
    },
    // Bežný text
    body: {
      name: 'Inter',
      weights: [400, 500, 600, 700],
      fallback: 'sans-serif',
    },
    // Kód (voliteľné)
    mono: {
      name: 'JetBrains Mono',
      weights: [400, 500],
      fallback: 'monospace',
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // BORDER RADIUS
  // ═══════════════════════════════════════════════════════════
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',
  },
  
  // ═══════════════════════════════════════════════════════════
  // BOX SHADOWS
  // ═══════════════════════════════════════════════════════════
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    // Farebný tieň pre tlačidlá (používa primárnu farbu)
    glow: '0 4px 14px 0 rgba(236, 72, 153, 0.4)',
    glowLg: '0 8px 25px 0 rgba(236, 72, 153, 0.5)',
  },
  
  // ═══════════════════════════════════════════════════════════
  // ANIMÁCIE
  // ═══════════════════════════════════════════════════════════
  animation: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      DEFAULT: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // SPACING (voliteľné custom hodnoty)
  // ═══════════════════════════════════════════════════════════
  spacing: {
    section: '6rem',     // Vertikálny padding sekcií
    container: '1.5rem', // Horizontálny padding containera
  },
  
  // ═══════════════════════════════════════════════════════════
  // BREAKPOINTS (štandardné Tailwind)
  // ═══════════════════════════════════════════════════════════
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

export type ThemeConfig = typeof themeConfig

// ═══════════════════════════════════════════════════════════
// HELPER: Generovanie CSS premenných z config
// ═══════════════════════════════════════════════════════════
export function generateCSSVariables(): string {
  const { colors, radius, shadows, animation } = themeConfig
  
  let css = ':root {\n'
  
  // Primary colors
  Object.entries(colors.primary).forEach(([shade, value]) => {
    const rgb = hexToRgb(value)
    css += `  --color-primary-${shade}: ${rgb};\n`
  })
  
  // Radius
  css += `  --radius: ${radius.DEFAULT};\n`
  
  // Animation
  css += `  --transition-duration: ${animation.duration.DEFAULT};\n`
  css += `  --transition-easing: ${animation.easing.DEFAULT};\n`
  
  css += '}\n'
  
  return css
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
}
```

---

## 4. Config Export

```typescript
// src/config/index.ts

export { siteConfig, type SiteConfig } from './site.config'
export { themeConfig, type ThemeConfig, generateCSSVariables } from './theme.config'

// ═══════════════════════════════════════════════════════════
// HELPER FUNKCIE
// ═══════════════════════════════════════════════════════════

/**
 * Získa farbu z theme config
 * @example getColor('primary', 500) => '#ec4899'
 */
export function getColor(colorName: keyof typeof themeConfig.colors, shade: number = 500): string {
  const colorPalette = themeConfig.colors[colorName] as Record<number, string>
  return colorPalette?.[shade] || colorPalette?.[500] || '#000000'
}

/**
 * Získa gradient class z theme config
 * @example getGradient('hero') => 'from-pink-50 via-white to-rose-50'
 */
export function getGradient(name: keyof typeof themeConfig.gradients): string {
  return themeConfig.gradients[name]
}

/**
 * Formátuje copyright text
 * @example formatCopyright() => '© 2024 Beauty Academy s.r.o. Všetky práva vyhradené.'
 */
export function formatCopyright(): string {
  const { content, company } = siteConfig
  return content.footer.copyright
    .replace('{year}', new Date().getFullYear().toString())
    .replace('{company}', company.legalName)
}

/**
 * Získa social linky (len tie ktoré sú definované)
 */
export function getSocialLinks() {
  return Object.entries(siteConfig.social)
    .filter(([_, url]) => url !== null)
    .map(([platform, url]) => ({ platform, url: url as string }))
}

/**
 * Kontrola či je feature zapnutá
 */
export function isFeatureEnabled(feature: keyof typeof siteConfig.features): boolean {
  return siteConfig.features[feature]
}
```

---

## 5. Tailwind Config Integrácia

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import { themeConfig } from './src/config/theme.config'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Farby z theme config
      colors: {
        primary: themeConfig.colors.primary,
        secondary: themeConfig.colors.secondary,
        accent: themeConfig.colors.accent,
        success: themeConfig.colors.success,
        error: themeConfig.colors.error,
      },
      
      // Font families
      fontFamily: {
        heading: [themeConfig.fonts.heading.name, themeConfig.fonts.heading.fallback],
        body: [themeConfig.fonts.body.name, themeConfig.fonts.body.fallback],
        mono: [themeConfig.fonts.mono.name, themeConfig.fonts.mono.fallback],
      },
      
      // Border radius
      borderRadius: themeConfig.radius,
      
      // Box shadows
      boxShadow: {
        ...themeConfig.shadows,
      },
      
      // Animácie
      transitionDuration: themeConfig.animation.duration,
      transitionTimingFunction: themeConfig.animation.easing,
      
      // Spacing
      spacing: {
        section: themeConfig.spacing.section,
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config
```

---

## 6. Použitie v Komponentoch

### Hero Component

```typescript
// src/components/home/Hero.tsx
import { siteConfig, getGradient } from '@/config'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  const { hero, stats, cta } = siteConfig.content
  
  return (
    <section className={`relative min-h-[90vh] flex items-center bg-gradient-to-br ${getGradient('hero')}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            {hero.badge}
          </span>
          
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            {hero.title}{' '}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${getGradient('text')}`}>
              {hero.titleHighlight}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed font-body">
            {hero.subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/kurzy">
                {cta.viewCourses}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-12 pt-12 border-t border-gray-200">
            <div>
              <p className="text-4xl font-bold text-gray-900">{stats.students.value}</p>
              <p className="text-gray-600">{stats.students.label}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">{stats.courses.value}</p>
              <p className="text-gray-600">{stats.courses.label}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">{stats.satisfaction.value}</p>
              <p className="text-gray-600">{stats.satisfaction.label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### Footer Component

```typescript
// src/components/layout/Footer.tsx
import Link from 'next/link'
import { siteConfig, formatCopyright, getSocialLinks, isFeatureEnabled } from '@/config'
import { Logo } from '@/components/shared/Logo'
import { Instagram, Facebook, Youtube } from 'lucide-react'

const socialIcons: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
}

export function Footer() {
  const { company, contact, navigation, content } = siteConfig
  const socialLinks = getSocialLinks()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo variant="light" />
              <span className="font-heading font-bold text-xl text-white">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm max-w-sm mb-4">
              {content.footer.description}
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map(({ platform, url }) => {
                  const Icon = socialIcons[platform]
                  return Icon ? (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-400 transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ) : null
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">Odkazy</h4>
            <ul className="space-y-2 text-sm">
              {navigation.main.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Právne</h4>
            <ul className="space-y-2 text-sm">
              {navigation.footer.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-gray-500">
              <p>{company.legalName}</p>
              <p>IČO: {company.ico}</p>
              {company.icDph && <p>IČ DPH: {company.icDph}</p>}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>{formatCopyright()}</p>
        </div>
      </div>
    </footer>
  )
}
```

### Metadata (SEO)

```typescript
// src/app/layout.tsx
import { siteConfig } from '@/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.seo.ogImage }],
    locale: siteConfig.seo.locale,
    type: 'website',
  },
}
```

---

## 7. Duplikovanie pre Nového Klienta

### Čo Zmeniť

| Súbor | Čo Upraviť |
|-------|------------|
| `src/config/site.config.ts` | Názov, kontakty, firemné údaje, texty |
| `src/config/theme.config.ts` | Farby (primary), fonty |
| `public/images/logo.svg` | Logo |
| `public/images/logo-dark.svg` | Logo pre dark mode |
| `public/images/og-image.jpg` | Social sharing obrázok |
| `public/favicon.ico` | Favicon |
| `.env.local` | API keys, domény |

### Príklad: Zmena na Modrú Tému

```typescript
// src/config/theme.config.ts
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Modrá namiesto ružovej
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
}
```

**Výsledok:** Celá stránka bude mať modrú farebnú schému bez zmeny akéhokoľvek komponentu!

---

## 8. Checklist pre Nového Klienta

```markdown
## Nový Klient: [Názov]

### 1. Konfigurácia
- [ ] Upraviť `site.config.ts`:
  - [ ] name, shortName, description, tagline
  - [ ] contact (email, phone, address)
  - [ ] social links
  - [ ] company údaje
  - [ ] app ID
  - [ ] SEO údaje
  - [ ] texty (hero, stats, cta, footer)
  
- [ ] Upraviť `theme.config.ts`:
  - [ ] primary color palette
  - [ ] secondary color (voliteľné)
  - [ ] gradienty
  - [ ] fonty

### 2. Assets
- [ ] Logo (SVG, min 200x50px)
- [ ] Logo dark variant
- [ ] OG Image (1200x630px)
- [ ] Favicon (512x512px)
- [ ] App Icon (1024x1024px)

### 3. Environment
- [ ] Stripe account
- [ ] Cloudflare Stream account
- [ ] Resend account + doména
- [ ] Neon database
- [ ] Vercel project

### 4. Testovanie
- [ ] Všetky farby správne
- [ ] Logo zobrazené
- [ ] Texty správne
- [ ] Kontaktné údaje v pätičke
- [ ] SEO meta tagy
```

---

## 📋 Súhrn

**Pre zmenu vizuálu a údajov o klientovi NIKDY nemeňte:**
- Komponenty v `src/components/`
- Stránky v `src/app/`
- API routes
- Utility funkcie

**VŽDY meňte LEN:**
- `src/config/site.config.ts`
- `src/config/theme.config.ts`
- `public/images/`

---

*Konfigurovateľný dizajn systém pre jednoduché prispôsobenie a duplikovanie.*

