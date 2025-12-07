import type { Metadata } from 'next'
import './globals.css'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.seo.locale,
    type: 'website',
  },
}

// Root layout is minimal - each route group has its own HTML structure
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
