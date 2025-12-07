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
  
  // OpenGraph pre Facebook, LinkedIn, atď.
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    images: [
      {
        url: `${siteConfig.url}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  
  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.description,
    images: [`${siteConfig.url}/images/og-image.jpg`],
  },
  
  // Robots - indexovanie
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification pre search engines
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Manifest pre PWA
  manifest: '/manifest.json',
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
