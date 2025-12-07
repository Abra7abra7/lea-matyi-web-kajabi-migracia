import { siteConfig } from '@/config'

/**
 * Generuje Organization Schema.org markup
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.company.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: 'customer service',
      availableLanguage: ['Slovak'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressLocality: 'Bratislava',
      addressCountry: 'SK',
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.youtube,
    ].filter(Boolean),
  }
}

/**
 * Generuje Course Schema.org markup
 */
export function generateCourseSchema(course: {
  title: string
  shortDescription?: string
  description?: string
  slug: string
  price?: number
  instructor?: string
  totalDuration?: number
  coverImage?: { url: string }
  category?: string
}) {
  const courseUrl = `${siteConfig.url}/kurzy/${course.slug}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.shortDescription || course.description,
    url: courseUrl,
    provider: {
      '@type': 'Organization',
      name: siteConfig.company.legalName,
      sameAs: siteConfig.url,
    },
    ...(course.instructor && {
      instructor: {
        '@type': 'Person',
        name: course.instructor,
      },
    }),
    ...(course.coverImage?.url && {
      image: course.coverImage.url,
    }),
    ...(course.price && {
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: courseUrl,
      },
    }),
    ...(course.totalDuration && {
      timeRequired: `PT${course.totalDuration}M`,
    }),
    inLanguage: 'sk',
    courseMode: 'online',
    educationalLevel: 'Beginner',
    ...(course.category && {
      about: getCategorySubject(course.category),
    }),
  }
}

/**
 * Generuje VideoObject Schema.org markup
 */
export function generateVideoSchema(video: {
  title: string
  description?: string
  thumbnailUrl?: string
  duration?: number // v minútach
  uploadDate?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || video.title,
    ...(video.thumbnailUrl && { thumbnailUrl: video.thumbnailUrl }),
    ...(video.duration && { duration: `PT${video.duration}M` }),
    uploadDate: video.uploadDate || new Date().toISOString(),
    contentUrl: siteConfig.url,
    embedUrl: siteConfig.url,
  }
}

/**
 * Generuje WebPage Schema.org markup
 */
export function generateWebPageSchema(page: {
  title: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    inLanguage: 'sk',
  }
}

/**
 * Generuje FAQPage Schema.org markup
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generuje BreadcrumbList Schema.org markup
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Helper funkcie
function getCategorySubject(category: string) {
  const subjects: Record<string, string> = {
    pmu: 'Permanent Makeup',
    nails: 'Nail Art',
    cosmetics: 'Cosmetology',
    makeup: 'Makeup Artistry',
    hair: 'Hair Styling',
  }
  return subjects[category] || 'Beauty'
}

/**
 * Komponent pre vloženie JSON-LD do stránky
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const jsonLd = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}

