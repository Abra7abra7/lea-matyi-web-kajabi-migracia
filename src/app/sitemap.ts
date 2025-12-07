import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { siteConfig } from '@/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Statické stránky
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/kurzy`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/o-nas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/prihlasenie`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/registracia`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/obchodne-podmienky`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ochrana-osobnych-udajov`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamické stránky - kurzy
  let coursePages: MetadataRoute.Sitemap = []
  
  try {
    const payload = await getPayloadClient()
    const courses = await payload.find({
      collection: 'courses',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    })

    coursePages = courses.docs.map((course: any) => ({
      url: `${baseUrl}/kurzy/${course.slug}`,
      lastModified: new Date(course.updatedAt || course.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error generating sitemap for courses:', error)
  }

  return [...staticPages, ...coursePages]
}

