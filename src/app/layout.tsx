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
}

// Root layout - passthrough for route groups
// Each route group defines its own html/body
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
