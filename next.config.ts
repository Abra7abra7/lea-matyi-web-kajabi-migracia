import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ═══════════════════════════════════════════════════════════
  // IMAGE OPTIMIZATION
  // ═══════════════════════════════════════════════════════════
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudflarestream.com',
      },
      {
        protocol: 'https',
        hostname: 'videodelivery.net',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // COMPRESSION & PERFORMANCE
  // ═══════════════════════════════════════════════════════════
  compress: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // ═══════════════════════════════════════════════════════════
  // HEADERS - CACHING & SECURITY
  // ═══════════════════════════════════════════════════════════
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // REDIRECTS
  // ═══════════════════════════════════════════════════════════
  async redirects() {
    return [
      // Redirect www to non-www (v produkcii)
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'www.beautyacademy.sk' }],
      //   destination: 'https://beautyacademy.sk/:path*',
      //   permanent: true,
      // },
    ]
  },
}

export default withPayload(nextConfig)

