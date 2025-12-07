// Helper pre správne formátovanie URL
function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  // Pridaj https:// ak chýba protokol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  // Odstráň trailing slash
  return url.replace(/\/$/, '')
}

export const siteConfig = {
  // ═══════════════════════════════════════════════════════════
  // ZÁKLADNÉ ÚDAJE
  // ═══════════════════════════════════════════════════════════
  name: 'Beauty Academy',
  shortName: 'BA',
  description: 'Profesionálne online kurzy v oblasti beauty',
  tagline: 'Staňte sa profesionálom v beauty priemysle',
  
  // URL (bez trailing slash)
  url: getAppUrl(),
  
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
    icDph: 'SK2012345678',
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
    iosUrl: null,
    androidUrl: null,
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
    googleAnalyticsId: null,
  },
  
  // ═══════════════════════════════════════════════════════════
  // TEXTY NA STRÁNKACH
  // ═══════════════════════════════════════════════════════════
  content: {
    hero: {
      badge: 'Online vzdelávanie v oblasti beauty',
      title: 'Staňte sa profesionálom v',
      titleHighlight: 'beauty priemysle',
      subtitle: 'Profesionálne online kurzy permanentného makeupu, nail art a ďalších beauty techník. Učte sa vlastným tempom od najlepších odborníkov v odbore.',
    },
    
    stats: {
      students: { value: '500+', label: 'Spokojných študentov' },
      courses: { value: '15+', label: 'Profesionálnych kurzov' },
      satisfaction: { value: '100%', label: 'Online prístup' },
    },
    
    cta: {
      viewCourses: 'Prezrieť kurzy',
      watchDemo: 'Pozrieť ukážku',
      buyNow: 'Kúpiť teraz',
      startLearning: 'Začať študovať',
      continueWatching: 'Pokračovať',
    },
    
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
    
    footer: {
      description: 'Profesionálne online kurzy v oblasti beauty. Učte sa od najlepších odborníkov z pohodlia domova.',
      copyright: '© {year} {company}. Všetky práva vyhradené.',
    },
    
    empty: {
      noCourses: 'Momentálne nie sú dostupné žiadne kurzy.',
      noOwnedCourses: 'Zatiaľ nemáte žiadne kurzy',
      noOwnedCoursesDescription: 'Prezrite si našu ponuku a začnite sa učiť už dnes.',
    },
    
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

export type SiteConfig = typeof siteConfig

