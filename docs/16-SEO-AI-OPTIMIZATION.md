# 🤖 SEO & AI Search Optimization

## Prehľad

Optimalizácia pre tradičné vyhľadávače aj AI systémy:
- **Google Search** - SEO, sitemap, structured data
- **Perplexity AI** - Schema.org, čistý obsah
- **ChatGPT Browse** - JSON-LD, meta descriptions
- **Tavily** - Headings hierarchy, semantic HTML
- **Bing/Copilot** - OpenGraph, Twitter cards

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI CRAWLER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Schema.org │  │   Meta      │  │  Sitemap    │              │
│  │   JSON-LD   │  │   Tags      │  │   + Robots  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              ŠTRUKTÚROVANÉ DÁTA                                  │
│  Organization │ Course │ VideoObject │ Product │ FAQ            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Schema.org JSON-LD

### Base Schema Component

```typescript
// src/components/seo/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

### Organization Schema (Globálne)

```typescript
// src/components/seo/OrganizationSchema.tsx
import { siteConfig } from '@/config'
import { JsonLd } from './JsonLd'

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.company.legalName,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/images/logo.png`,
    },
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressCountry: 'SK',
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  }

  return <JsonLd data={schema} />
}
```

### Course Schema

```typescript
// src/components/seo/CourseSchema.tsx
import { siteConfig } from '@/config'
import { JsonLd } from './JsonLd'
import type { Course } from '@/types/payload-types'

interface CourseSchemaProps {
  course: Course
}

export function CourseSchema({ course }: CourseSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${siteConfig.url}/kurzy/${course.slug}`,
    name: course.title,
    description: course.shortDescription || course.description,
    url: `${siteConfig.url}/kurzy/${course.slug}`,
    provider: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.company.legalName,
    },
    // Cena
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${siteConfig.url}/kurzy/${course.slug}`,
      validFrom: new Date().toISOString(),
    },
    // Obrázok
    image: course.coverImage?.url,
    // Moduly ako syllabus
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${course.totalDuration || 60}M`,
    },
    // Počet lekcií
    numberOfCredits: course.lessonsCount || 0,
    // Jazyk
    inLanguage: 'sk',
    // Kategória
    courseCode: course.slug,
    // Audience
    audience: {
      '@type': 'Audience',
      audienceType: 'Beauty professionals',
    },
  }

  return <JsonLd data={schema} />
}
```

### VideoObject Schema

```typescript
// src/components/seo/VideoSchema.tsx
import { siteConfig } from '@/config'
import { JsonLd } from './JsonLd'

interface VideoSchemaProps {
  title: string
  description: string
  thumbnailUrl: string
  duration: number // v sekundách
  uploadDate: string
  courseTitle: string
}

export function VideoSchema({
  title,
  description,
  thumbnailUrl,
  duration,
  uploadDate,
  courseTitle,
}: VideoSchemaProps) {
  // Konverzia sekúnd na ISO 8601 duration
  const isoDuration = `PT${Math.floor(duration / 60)}M${duration % 60}S`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description: description || `Video lekcia z kurzu ${courseTitle}`,
    thumbnailUrl,
    uploadDate,
    duration: isoDuration,
    contentUrl: siteConfig.url, // Signed URL sa negeneruje pre schému
    embedUrl: siteConfig.url,
    publisher: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.company.legalName,
    },
    // Prístupnosť
    requiresSubscription: {
      '@type': 'MediaSubscription',
      expectsAcceptanceOf: {
        '@type': 'Offer',
        category: 'purchase',
      },
    },
  }

  return <JsonLd data={schema} />
}
```

### Product Schema (Pre nákup)

```typescript
// src/components/seo/ProductSchema.tsx
import { siteConfig } from '@/config'
import { JsonLd } from './JsonLd'
import type { Course } from '@/types/payload-types'

interface ProductSchemaProps {
  course: Course
}

export function ProductSchema({ course }: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: course.title,
    description: course.shortDescription,
    image: course.coverImage?.url,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${siteConfig.url}/kurzy/${course.slug}`,
      seller: {
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    // Aggregate rating (ak máte hodnotenia)
    // aggregateRating: {
    //   '@type': 'AggregateRating',
    //   ratingValue: '4.8',
    //   reviewCount: '125',
    // },
  }

  return <JsonLd data={schema} />
}
```

### BreadcrumbList Schema

```typescript
// src/components/seo/BreadcrumbSchema.tsx
import { siteConfig } from '@/config'
import { JsonLd } from './JsonLd'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  }

  return <JsonLd data={schema} />
}
```

### FAQ Schema

```typescript
// src/components/seo/FaqSchema.tsx
import { JsonLd } from './JsonLd'

interface FaqItem {
  question: string
  answer: string
}

interface FaqSchemaProps {
  items: FaqItem[]
}

export function FaqSchema({ items }: FaqSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return <JsonLd data={schema} />
}
```

---

## 2. Meta Tags Component

```typescript
// src/components/seo/MetaTags.tsx
import { Metadata } from 'next'
import { siteConfig } from '@/config'

interface GenerateMetadataProps {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article' | 'product'
  noIndex?: boolean
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
}: GenerateMetadataProps): Metadata {
  const url = `${siteConfig.url}${path}`
  const ogImage = image || siteConfig.seo.ogImage

  return {
    title,
    description,
    
    // Robots
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    
    // Canonical
    alternates: {
      canonical: url,
    },
    
    // OpenGraph
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${siteConfig.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: siteConfig.seo.locale,
      type,
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${siteConfig.url}${ogImage}`],
    },
    
    // Verification (ak máte)
    // verification: {
    //   google: 'xxx',
    //   yandex: 'xxx',
    // },
  }
}
```

---

## 3. Sitemap Generátor

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { siteConfig } from '@/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })

  // Statické stránky
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/kurzy`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/o-nas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamické stránky - kurzy
  const courses = await payload.find({
    collection: 'courses',
    where: { status: { equals: 'published' } },
    limit: 1000,
  })

  const coursePages: MetadataRoute.Sitemap = courses.docs.map((course) => ({
    url: `${siteConfig.url}/kurzy/${course.slug}`,
    lastModified: new Date(course.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...coursePages]
}
```

---

## 4. Robots.txt

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'
import { siteConfig } from '@/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/*.json$',
        ],
      },
      // AI Crawlers - povolené
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Applebot',
        allow: '/',
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

---

## 5. Použitie v Stránkach

### Homepage

```typescript
// src/app/(frontend)/page.tsx
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { generatePageMetadata } from '@/components/seo/MetaTags'
import { siteConfig } from '@/config'

export const metadata = generatePageMetadata({
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.description,
  path: '/',
})

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <BreadcrumbSchema items={[{ name: 'Domov', href: '/' }]} />
      
      {/* Page content */}
    </>
  )
}
```

### Detail Kurzu

```typescript
// src/app/(frontend)/kurzy/[slug]/page.tsx
import { CourseSchema } from '@/components/seo/CourseSchema'
import { ProductSchema } from '@/components/seo/ProductSchema'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { generatePageMetadata } from '@/components/seo/MetaTags'

export async function generateMetadata({ params }: Props) {
  const course = await getCourse(params.slug)
  
  return generatePageMetadata({
    title: course.title,
    description: course.shortDescription || '',
    path: `/kurzy/${course.slug}`,
    image: course.coverImage?.url,
    type: 'product',
  })
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse(params.slug)

  return (
    <>
      <CourseSchema course={course} />
      <ProductSchema course={course} />
      <BreadcrumbSchema
        items={[
          { name: 'Domov', href: '/' },
          { name: 'Kurzy', href: '/kurzy' },
          { name: course.title, href: `/kurzy/${course.slug}` },
        ]}
      />
      
      {/* Page content */}
    </>
  )
}
```

### Lekcia s Videom

```typescript
// src/app/(frontend)/kurzy/[slug]/lekcia/[m]/[l]/page.tsx
import { VideoSchema } from '@/components/seo/VideoSchema'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'

export default async function LessonPage({ params }: Props) {
  const { course, lesson } = await getLesson(params)

  return (
    <>
      {lesson.videoCloudflareId && (
        <VideoSchema
          title={lesson.title}
          description={lesson.content || ''}
          thumbnailUrl={`https://customer-xxx.cloudflarestream.com/${lesson.videoCloudflareId}/thumbnails/thumbnail.jpg`}
          duration={(lesson.duration || 10) * 60}
          uploadDate={course.createdAt}
          courseTitle={course.title}
        />
      )}
      <BreadcrumbSchema
        items={[
          { name: 'Domov', href: '/' },
          { name: 'Kurzy', href: '/kurzy' },
          { name: course.title, href: `/kurzy/${course.slug}` },
          { name: lesson.title, href: `/kurzy/${course.slug}/lekcia/${params.m}/${params.l}` },
        ]}
      />
      
      {/* Page content */}
    </>
  )
}
```

---

## 6. Testovanie

### Google Rich Results Test
```
https://search.google.com/test/rich-results?url=https://vasa-domena.sk/kurzy/nazov-kurzu
```

### Schema.org Validator
```
https://validator.schema.org/
```

### OpenGraph Debugger
```
https://developers.facebook.com/tools/debug/
```

### Twitter Card Validator
```
https://cards-dev.twitter.com/validator
```

---

## 📋 Checklist

- [ ] JsonLd base komponent
- [ ] OrganizationSchema na všetkých stránkach
- [ ] CourseSchema na detail kurzu
- [ ] ProductSchema na detail kurzu
- [ ] VideoSchema na lekciách
- [ ] BreadcrumbSchema na všetkých stránkach
- [ ] Sitemap.xml generátor
- [ ] Robots.txt s AI crawlers
- [ ] OpenGraph meta tagy
- [ ] Twitter Card meta tagy
- [ ] Canonical URLs
- [ ] Google Rich Results Test - validné
- [ ] Schema.org Validator - bez chýb

---

*Optimalizácia pre AI vyhľadávače zabezpečí lepšiu viditeľnosť v Perplexity, ChatGPT a ďalších.*


