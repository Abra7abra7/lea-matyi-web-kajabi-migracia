import { MetadataRoute } from 'next'
import { siteConfig } from '@/config'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/_next/',
          '/static/',
        ],
      },
      // Špeciálne pravidlá pre AI crawlery
      {
        userAgent: 'GPTBot',
        allow: ['/kurzy/', '/o-nas', '/'],
        disallow: ['/admin/', '/api/', '/dashboard/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/kurzy/', '/o-nas', '/'],
        disallow: ['/admin/', '/api/', '/dashboard/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/kurzy/', '/o-nas', '/'],
        disallow: ['/admin/', '/api/', '/dashboard/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/kurzy/', '/o-nas', '/'],
        disallow: ['/admin/', '/api/', '/dashboard/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/kurzy/', '/o-nas', '/'],
        disallow: ['/admin/', '/api/', '/dashboard/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

